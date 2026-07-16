import express from "express";

import { prisma } from "../prisma.js";
import { isExpoPushToken } from "../notifications.js";
import { requireAuthentication } from "../http/authentication.js";

const router = express.Router();

router.use(requireAuthentication);

router.post("/", async (req, res, next) => {
  try {
    const { platform, token } = req.body;
    const user = req.authUser;

    if (!isExpoPushToken(token)) {
      return res.status(400).json({ error: "A valid Expo push token is required." });
    }
    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({ error: "Platform must be android or ios." });
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
        userId: req.authUser.id,
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
    userId: user?.id || null,
  };
}

export default router;
