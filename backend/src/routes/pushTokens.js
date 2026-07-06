import express from "express";

import { prisma } from "../prisma.js";
import { isExpoPushToken } from "../notifications.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { platform, token, user } = req.body;

    if (!isExpoPushToken(token)) {
      return res.status(400).json({ error: "A valid Expo push token is required." });
    }

    const pushTokenData = getPushTokenData({ platform, token, user });
    const pushToken = await prisma.pushToken.upsert({
      where: {
        token,
      },
      update: pushTokenData,
      create: pushTokenData,
    });

    res.status(201).json({ pushToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/:token", async (req, res, next) => {
  try {
    await prisma.pushToken.deleteMany({
      where: {
        token: req.params.token,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

function getPushTokenData({ platform, token, user }) {
  return {
    platform,
    token,
    userEmail: user?.email || null,
    userId: user?.id || null,
    userName: user?.name || null,
  };
}

export default router;
