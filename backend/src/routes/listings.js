import path from "node:path";

import express from "express";

import { env } from "../config/environment.js";
import { parseJsonField } from "../http/parsers.js";
import {
  requireAuthentication,
  requireAuthenticatedUser,
} from "../http/authentication.js";
import {
  createImageUpload,
  assertUploadedImages,
  deleteUploadedFiles,
  handleUploadError,
} from "../http/uploads.js";
import {
  notifySellerAboutInquiry,
  notifyUsersAboutNewListing,
} from "../listingNotifications.js";
import { formatListing } from "../listingPresentation.js";
import { prisma } from "../prisma.js";
import {
  normalizeListingText,
  normalizeListingLocation,
  validateInquiryMessage,
  validateListingDescription,
  validateListingLocation,
  validateListingPrice,
  validateListingTitle,
} from "../../../shared/listingValidation.js";
import { getListingCategoryDefinition } from "../../../shared/listingCategories.js";
import { inquiryRateLimit, uploadRateLimit } from "../http/security.js";

const router = express.Router();
const upload = createImageUpload({
  directory: "listings",
  fileSize: env.listingImageMaxBytes,
  files: env.listingImageLimit,
  message: "Only image uploads are supported.",
});

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

router.get("/", async (req, res, next) => {
  try {
    const page = getListingsPage(req.query);
    const listings = await prisma.listing.findMany({
      where: page.where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: page.limit + 1,
      ...(page.cursor
        ? {
            cursor: { id: page.cursor },
            skip: 1,
          }
        : {}),
      include: {
        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
        seller: {
          select: sellerSelect,
        },
      },
    });

    const hasMore = listings.length > page.limit;
    const pageListings = hasMore ? listings.slice(0, page.limit) : listings;

    res.json({
      listings: pageListings.map(formatListing),
      nextCursor: hasMore ? pageListings.at(-1)?.id || null : null,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
        seller: {
          select: sellerSelect,
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    res.json({ listing: formatListing(listing) });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  requireAuthentication,
  uploadRateLimit,
  upload.array("images", env.listingImageLimit),
  async (req, res, next) => {
    try {
      await assertUploadedImages(req.files);
      const category = parseJsonField(req.body.category);
      const rawLocation = parseJsonField(req.body.location);
      const location = normalizeListingLocation(rawLocation);
      const priceError = validateListingPrice(req.body.price);
      const price = priceError ? null : String(req.body.price).trim();
      const description = normalizeListingText(req.body.description);
      const title = normalizeListingText(req.body.title);
      const sellerSnapshot = await resolveSellerSnapshot(req.authUser.id);
      const categoryDefinition = getListingCategoryDefinition(category?.value);
      const locationError = getLocationError(req.body.location, rawLocation);

      const textError =
        validateListingTitle(title) || validateListingDescription(description);
      if (!sellerSnapshot.userId) {
        await deleteUploadedFiles(req.files);
        return res.status(401).json({ error: "Your account session is no longer valid." });
      }
      if (textError || locationError || !categoryDefinition) {
        await deleteUploadedFiles(req.files);
        return res.status(400).json({
          error: textError || locationError || "A valid category is required.",
        });
      }

      if (price === null) {
        await deleteUploadedFiles(req.files);
        return res.status(400).json({
          error: priceError,
        });
      }

      if (!req.files?.length) {
        return res.status(400).json({
          error: "Please upload at least one listing image.",
        });
      }

      const listing = await prisma.listing.create({
        data: {
          title,
          price,
          currency: env.marketCurrencyCode,
          categoryId: categoryDefinition.id,
          categoryLabel: categoryDefinition.label,
          description,
          location,
          sellerUserId: sellerSnapshot.userId,
          images: {
            create: req.files.map((file) => ({
              filename: file.filename,
              mimetype: file.mimetype,
              path: path.relative(process.cwd(), file.path),
              size: file.size,
            })),
          },
        },
        include: {
          images: true,
          seller: {
            select: sellerSelect,
          },
        },
      });

      const formattedListing = formatListing(listing);
      void notifyUsersAboutNewListing(formattedListing);

      res.status(201).json({ listing: formattedListing });
    } catch (error) {
      await deleteUploadedFiles(req.files);
      next(error);
    }
  }
);

router.post("/:id/inquiries", inquiryRateLimit, async (req, res, next) => {
  try {
    const buyer = requireAuthenticatedUser(req, res);
    if (!buyer) return;

    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    if (listing.sellerUserId === buyer.id) {
      return res.status(400).json({ error: "You cannot inquire about your own listing." });
    }

    const message = normalizeListingText(req.body.message);
    const messageError = validateInquiryMessage(message);
    if (messageError) {
      return res.status(400).json({ error: messageError });
    }

    const duplicateSince = new Date(Date.now() - 60_000);
    const duplicateInquiry = await prisma.listingInquiry.findFirst({
      where: {
        buyerId: buyer.id,
        listingId: listing.id,
        message,
        createdAt: { gte: duplicateSince },
      },
      select: { id: true },
    });
    if (duplicateInquiry) {
      return res.status(409).json({ error: "That inquiry was already sent." });
    }

    const inquiry = await prisma.listingInquiry.create({
      data: {
        buyerId: buyer.id || null,
        listingId: listing.id,
        message,
      },
    });

    void notifySellerAboutInquiry({ buyer, inquiry, listing });

    res.status(201).json({ inquiry });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const requester = requireAuthenticatedUser(req, res);
    if (!requester) return;

    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        images: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    if (!canManageListing(requester, listing)) {
      return res.status(403).json({
        error: "You can only delete your own listings.",
      });
    }

    await prisma.listing.delete({
      where: {
        id: listing.id,
      },
    });
    await deleteUploadedFiles(listing.images);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.use(handleUploadError);

function canManageListing(user, listing) {
  return Boolean(user?.id && listing.sellerUserId === user.id);
}

async function resolveSellerSnapshot(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      image: true,
      name: true,
      username: true,
    },
  });

  return {
    userId: user?.id || null,
  };
}

function getLocationError(serializedLocation, location) {
  const supplied = serializedLocation && serializedLocation !== "null";
  if (supplied && location === null) return "Location must contain valid JSON.";
  return validateListingLocation(location);
}

const sellerSelect = {
  id: true,
  image: true,
  name: true,
  username: true,
};

function getListingsPage(query) {
  const requestedLimit = Number(query.limit);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;
  const search = normalizeListingText(query.search).slice(0, 80);
  const category = getListingCategoryDefinition(query.category);

  return {
    cursor: typeof query.cursor === "string" && query.cursor ? query.cursor : null,
    limit,
    where: {
      status: "ACTIVE",
      ...(category ? { categoryId: category.id } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { categoryLabel: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  };
}

export default router;
