import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

const IMAGE_EXTENSIONS = Object.freeze({
  "image/png": ".png",
  "image/webp": ".webp",
});

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
    limits: { fileSize, files },
    fileFilter: (_req, file, callback) => {
      if (file.mimetype.startsWith("image/")) {
        callback(null, true);
        return;
      }

      callback(Object.assign(new Error(message), { statusCode: 400 }));
    },
  });
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
  return IMAGE_EXTENSIONS[file.mimetype] || ".jpg";
}

function resolveFilePath(file) {
  return path.isAbsolute(file.path)
    ? file.path
    : path.resolve(process.cwd(), file.path);
}
