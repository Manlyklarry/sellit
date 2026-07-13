import path from "node:path";

import express from "express";

import { env } from "../config/environment.js";
import { parseJsonField } from "../http/parsers.js";
import {
  createImageUpload,
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
  validateListingDescription,
  validateListingTitle,
} from "../../../shared/listingValidation.js";

const router = express.Router();
const upload = createImageUpload({
  directory: "listings",
  fileSize: env.listingImageMaxBytes,
  files: env.listingImageLimit,
  message: "Only image uploads are supported.",
});

router.get("/", async (_req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: "desc",
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

    res.json({ listings: listings.map(formatListing) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
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

router.post("/", upload.array("images", env.listingImageLimit), async (req, res, next) => {
  try {
    const category = parseJsonField(req.body.category);
    const location = parseJsonField(req.body.location);
    const seller = parseJsonField(req.body.seller);
    const price = parsePrice(req.body.price);
    const description = normalizeListingText(req.body.description);
    const title = normalizeListingText(req.body.title);
    const sellerSnapshot = await resolveSellerSnapshot(seller);

    if (!sellerSnapshot.userId && !sellerSnapshot.email) {
      await deleteUploadedFiles(req.files);
      return res.status(401).json({
        error: "Sign in before creating a listing.",
      });
    }

    const textError =
      validateListingTitle(title) || validateListingDescription(description);
    if (textError || !isValidCategory(category)) {
      await deleteUploadedFiles(req.files);
      return res.status(400).json({
        error: textError || "A valid category is required.",
      });
    }

    if (price === null) {
      await deleteUploadedFiles(req.files);
      return res.status(400).json({
        error: "Price must be a positive number.",
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
        categoryId: category.value,
        categoryLabel: category.label,
        description,
        location,
        sellerEmail: sellerSnapshot.email,
        sellerName: sellerSnapshot.name,
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
    notifyUsersAboutNewListing(formattedListing);

    res.status(201).json({ listing: formattedListing });
  } catch (error) {
    await deleteUploadedFiles(req.files);
    next(error);
  }
});

router.post("/:id/inquiries", async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    const message = String(req.body.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const buyer = req.body.buyer || {};
    const inquiry = await prisma.listingInquiry.create({
      data: {
        buyerEmail: buyer.email || null,
        buyerId: buyer.id || null,
        buyerName: buyer.name || null,
        listingId: listing.id,
        message,
      },
    });

    notifySellerAboutInquiry({ buyer, inquiry, listing });

    res.status(201).json({ inquiry });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const requester = req.body?.user || {};
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
      return res.status(getManageListingStatus(requester)).json({
        error: requester?.id || requester?.email
          ? "You can only delete your own listings."
          : "Sign in before deleting a listing.",
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
  if (!listing.sellerUserId && !listing.sellerEmail) {
    return false;
  }

  return Boolean(
    (user?.id && listing.sellerUserId && user.id === listing.sellerUserId) ||
      (user?.email &&
        listing.sellerEmail &&
        user.email.toLowerCase() === listing.sellerEmail.toLowerCase())
  );
}

function getManageListingStatus(user) {
  return user?.id || user?.email ? 403 : 401;
}

function parsePrice(value) {
  const price = Number(value);

  return Number.isFinite(price) && price > 0 ? price : null;
}

function isValidCategory(category) {
  return Boolean(
    category &&
      Number.isInteger(category.value) &&
      typeof category.label === "string" &&
      category.label.trim()
  );
}

async function resolveSellerSnapshot(seller) {
  if (!seller || typeof seller !== "object") {
    return {
      email: null,
      name: null,
      userId: null,
    };
  }

  const id = typeof seller.id === "string" ? seller.id : null;
  const email = typeof seller.email === "string" ? seller.email : null;
  const name = typeof seller.name === "string" ? seller.name : null;

  if (!id && !email) {
    return {
      email,
      name,
      userId: null,
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [id ? { id } : null, email ? { email } : null].filter(Boolean),
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
    email: email || user?.email || null,
    name: name || user?.name || null,
    userId: user?.id || null,
  };
}

const sellerSelect = {
  email: true,
  id: true,
  image: true,
  name: true,
  username: true,
};

export default router;
