import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

const IMAGE_EXTENSIONS = Object.freeze({
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
});
const ALLOWED_IMAGE_TYPES = new Set(Object.keys(IMAGE_EXTENSIONS));

export function createImageUpload({ directory, fileSize, files, message }) {
  const uploadDirectory = path.join(process.cwd(), "uploads", directory);
  fs.mkdirSync(uploadDirectory, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, uploadDirectory),
      filename: (_req, file, callback) => {
        callback(null, `${randomUUID()}${getImageExtension(file)}`);
      },
    }),
    limits: {
      fieldSize: 16 * 1024,
      fields: 10,
      fileSize,
      files,
      parts: files + 10,
    },
    fileFilter: (_req, file, callback) => {
      if (ALLOWED_IMAGE_TYPES.has(normalizeMimeType(file.mimetype))) {
        callback(null, true);
        return;
      }

      callback(Object.assign(new Error(message), { statusCode: 400 }));
    },
  });
}

export async function assertUploadedImages(files = []) {
  const values = Array.isArray(files) ? files : [files];

  for (const file of values.filter(Boolean)) {
    const handle = await fs.promises.open(resolveFilePath(file), "r");
    try {
      const buffer = Buffer.alloc(16);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      const detectedType = detectImageType(buffer.subarray(0, bytesRead));
      const declaredType = normalizeMimeType(file.mimetype);

      if (!detectedType || detectedType !== declaredType) {
        throw Object.assign(
          new Error("An uploaded file is not a supported JPEG, PNG, or WebP image."),
          { statusCode: 400 }
        );
      }
    } finally {
      await handle.close();
    }
  }
}

export async function deleteUploadedFiles(files = []) {
  const values = Array.isArray(files) ? files : [files];

  await Promise.allSettled(
    values.filter(Boolean).map((file) => fs.promises.unlink(resolveFilePath(file)))
  );
}

export function handleUploadError(error, _req, res, next) {
  if (error instanceof multer.MulterError || error.statusCode === 400) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
}

function getImageExtension(file) {
  return IMAGE_EXTENSIONS[normalizeMimeType(file.mimetype)] || ".jpg";
}

function normalizeMimeType(value) {
  return value === "image/jpg" ? "image/jpeg" : String(value || "").toLowerCase();
}

function detectImageType(buffer) {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }

  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function resolveFilePath(file) {
  return path.isAbsolute(file.path)
    ? file.path
    : path.resolve(process.cwd(), file.path);
}
