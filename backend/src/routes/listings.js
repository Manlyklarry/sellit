import fs from "node:fs";
import path from "node:path";

import express from "express";
import multer from "multer";

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
    const price = parsePrice(req.body.price);

    if (!req.body.title || !req.body.description || !isValidCategory(category)) {
      await deleteUploadedFiles(req.files);
      return res.status(400).json({
        error: "Title, price, category, and description are required.",
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

    res.status(201).json({ listing });
  } catch (error) {
    await deleteUploadedFiles(req.files);
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
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images,
    imageUrl: images[0]?.url || null,
  };
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
    files.map((file) => fs.promises.unlink(path.resolve(process.cwd(), file.path)))
  );
}

export default router;
