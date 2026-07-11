import fs from "node:fs";
import path from "node:path";

import express from "express";
import multer from "multer";

import { prisma } from "../prisma.js";

const router = express.Router();
const uploadDirectory = path.join(process.cwd(), "uploads", "profiles");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = getSafeImageExtension(file);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(Object.assign(new Error("Only profile image uploads are supported."), {
      statusCode: 400,
    }));
  },
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
});

router.put("/profile", upload.single("image"), async (req, res, next) => {
  try {
    const requester = parseJsonField(req.body.user);
    const userId = typeof requester?.id === "string" ? requester.id : null;
    const email = typeof requester?.email === "string" ? requester.email : null;

    if (!userId && !email) {
      await deleteUploadedFile(req.file);
      return res.status(401).json({ error: "Sign in before updating your profile." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [userId ? { id: userId } : null, email ? { email } : null].filter(Boolean),
      },
      select: {
        ...userSelect,
        image: true,
      },
    });

    if (!existingUser) {
      await deleteUploadedFile(req.file);
      return res.status(404).json({ error: "User not found." });
    }

    const name = normalizeDisplayName(req.body.name);
    const username = normalizeUsername(req.body.username);
    const removeImage = req.body.removeImage === "true";

    if (!name.ok) {
      await deleteUploadedFile(req.file);
      return res.status(400).json({ error: name.error });
    }

    if (!username.ok) {
      await deleteUploadedFile(req.file);
      return res.status(400).json({ error: username.error });
    }

    if (username.value) {
      const conflictingUser = await prisma.user.findFirst({
        where: {
          username: username.value,
          NOT: {
            id: existingUser.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (conflictingUser) {
        await deleteUploadedFile(req.file);
        return res.status(409).json({ error: "That username is already taken." });
      }
    }

    const imagePath = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : removeImage
        ? null
        : existingUser.image;

    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        image: imagePath,
        name: name.value,
        username: username.value,
      },
      select: userSelect,
    });

    if ((req.file || removeImage) && existingUser.image) {
      await deleteStoredProfileImage(existingUser.image);
    }

    res.json({ user: formatUser(updatedUser) });
  } catch (error) {
    await deleteUploadedFile(req.file);
    next(error);
  }
});

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError || error.statusCode === 400) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
});

const userSelect = {
  email: true,
  id: true,
  image: true,
  name: true,
  username: true,
};

function formatUser(user) {
  return {
    email: user.email,
    id: user.id,
    image: user.image || null,
    name: user.name,
    username: user.username || null,
  };
}

function normalizeDisplayName(value) {
  const name = String(value || "").replace(/\s+/g, " ").trim();

  if (name.length < 2) {
    return { ok: false, error: "Display name must be at least 2 characters." };
  }

  if (name.length > 80) {
    return { ok: false, error: "Display name must be 80 characters or less." };
  }

  return { ok: true, value: name };
}

function normalizeUsername(value) {
  const username = String(value || "").trim().toLowerCase();

  if (!username) {
    return { ok: true, value: null };
  }

  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return {
      ok: false,
      error: "Username must be 3-24 characters using letters, numbers, or underscores.",
    };
  }

  return { ok: true, value: username };
}

function parseJsonField(value) {
  if (!value || value === "null") return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getSafeImageExtension(file) {
  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  return ".jpg";
}

async function deleteUploadedFile(file) {
  if (!file) return;

  await fs.promises.unlink(file.path).catch(() => null);
}

async function deleteStoredProfileImage(imagePath) {
  if (!imagePath?.startsWith("/uploads/profiles/")) return;

  await fs.promises
    .unlink(path.join(process.cwd(), imagePath.replace(/^\//, "")))
    .catch(() => null);
}

export default router;
