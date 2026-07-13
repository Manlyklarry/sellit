import path from "node:path";

import express from "express";

import { env } from "../config/environment.js";
import { parseJsonField } from "../http/parsers.js";
import {
  createImageUpload,
  deleteUploadedFiles,
  handleUploadError,
} from "../http/uploads.js";
import { prisma } from "../prisma.js";
import {
  normalizeDisplayName as normalizeDisplayNameValue,
  normalizeUsername as normalizeUsernameValue,
  validateDisplayName,
  validateUsername,
} from "../../../shared/profileValidation.js";

const router = express.Router();
const upload = createImageUpload({
  directory: "profiles",
  fileSize: env.profileImageMaxBytes,
  files: 1,
  message: "Only profile image uploads are supported.",
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

router.use(handleUploadError);

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
  const error = validateDisplayName(value);
  return error
    ? { ok: false, error }
    : { ok: true, value: normalizeDisplayNameValue(value) };
}

function normalizeUsername(value) {
  const username = normalizeUsernameValue(value);
  if (!username) {
    return { ok: true, value: null };
  }
  const error = validateUsername(value);
  return error ? { ok: false, error } : { ok: true, value: username };
}

async function deleteUploadedFile(file) {
  await deleteUploadedFiles(file);
}

async function deleteStoredProfileImage(imagePath) {
  if (!imagePath?.startsWith("/uploads/profiles/")) return;

  await deleteUploadedFiles({
    path: path.join(process.cwd(), imagePath.replace(/^\//, "")),
  });
}

export default router;
