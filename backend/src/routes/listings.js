import fs from "node:fs";
import path from "node:path";

import express from "express";
import multer from "multer";

import { sendPushNotifications } from "../notifications.js";
import { prisma } from "../prisma.js";

const router = express.Router();
const uploadDirectory = path.join(process.cwd(), "uploads", "listings");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const safeName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    callback(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 6,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(Object.assign(new Error("Only image uploads are supported."), {
      statusCode: 400,
    }));
  },
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
      },
    });

    res.json({ listings: listings.map(formatListing) });
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.array("images", 6), async (req, res, next) => {
  try {
    const category = parseJsonField(req.body.category);
    const location = parseJsonField(req.body.location);
    const seller = parseJsonField(req.body.seller);
    const price = parsePrice(req.body.price);

    if (!req.body.title || !req.body.description || !isValidCategory(category)) {
      await deleteUploadedFiles(req.files);
      return res.status(400).json({
        error: "Name of item, price, category, and description are required.",
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
        title: req.body.title,
        price,
        categoryId: category.value,
        categoryLabel: category.label,
        description: req.body.description,
        location,
        sellerEmail: seller?.email || null,
        sellerName: seller?.name || null,
        sellerUserId: seller?.id || null,
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
      },
    });

    notifyUsersAboutNewListing(formatListing(listing));

    res.status(201).json({ listing });
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

function formatListing(listing) {
  const images = listing.images.map((image) => ({
    id: image.id,
    filename: image.filename,
    mimetype: image.mimetype,
    size: image.size,
    url: `/uploads/listings/${image.filename}`,
  }));

  return {
    id: listing.id,
    title: listing.title,
    price: listing.price.toString(),
    categoryId: listing.categoryId,
    categoryLabel: listing.categoryLabel,
    description: listing.description,
    location: listing.location,
    sellerEmail: listing.sellerEmail,
    sellerName: listing.sellerName,
    sellerUserId: listing.sellerUserId,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images,
    imageUrl: images[0]?.url || null,
  };
}

async function notifyUsersAboutNewListing(listing) {
  try {
    const excludedSellers = [
      listing.sellerUserId ? { userId: listing.sellerUserId } : null,
      listing.sellerEmail ? { userEmail: listing.sellerEmail } : null,
    ].filter(Boolean);
    const tokens = await prisma.pushToken.findMany({
      where: excludedSellers.length ? { NOT: excludedSellers } : undefined,
    });

    await sendPushNotifications(
      tokens.map((token) => ({
        to: token.token,
        sound: "default",
        title: "New item listed",
        body: `${listing.sellerName || "Someone"} listed ${listing.title}.`,
        data: {
          listingId: listing.id,
          type: "new-listing",
        },
      }))
    );
  } catch (error) {
    console.error("Failed to send new listing notifications", error);
  }
}

async function notifySellerAboutInquiry({ buyer, inquiry, listing }) {
  try {
    if (!listing.sellerUserId && !listing.sellerEmail) return;

    const tokens = await prisma.pushToken.findMany({
      where: {
        OR: [
          listing.sellerUserId ? { userId: listing.sellerUserId } : undefined,
          listing.sellerEmail ? { userEmail: listing.sellerEmail } : undefined,
        ].filter(Boolean),
      },
    });

    await sendPushNotifications(
      tokens.map((token) => ({
        to: token.token,
        sound: "default",
        title: "Buyer inquiry",
        body: `${buyer?.name || buyer?.email || "Someone"} asked about ${
          listing.title
        }.`,
        data: {
          inquiryId: inquiry.id,
          listingId: listing.id,
          type: "listing-inquiry",
        },
      }))
    );
  } catch (error) {
    console.error("Failed to send inquiry notification", error);
  }
}

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError || error.statusCode === 400) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
});

function parseJsonField(value) {
  if (!value || value === "null") return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
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

async function deleteUploadedFiles(files = []) {
  await Promise.allSettled(
    files.map((file) => fs.promises.unlink(getUploadedFilePath(file)))
  );
}

function getUploadedFilePath(file) {
  return path.isAbsolute(file.path)
    ? file.path
    : path.resolve(process.cwd(), file.path);
}

export default router;
