import { randomUUID } from "node:crypto";

import { rateLimit } from "express-rate-limit";

const commonOptions = {
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests. Please try again later." });
  },
};

export const apiRateLimit = rateLimit({
  ...commonOptions,
  limit: 300,
  windowMs: 15 * 60 * 1000,
});

export const authRateLimit = rateLimit({
  ...commonOptions,
  limit: 20,
  skipSuccessfulRequests: true,
  windowMs: 15 * 60 * 1000,
});

export const inquiryRateLimit = rateLimit({
  ...commonOptions,
  limit: 12,
  windowMs: 15 * 60 * 1000,
});

export const uploadRateLimit = rateLimit({
  ...commonOptions,
  limit: 30,
  windowMs: 60 * 60 * 1000,
});

export function attachRequestId(req, res, next) {
  const suppliedId = req.get("x-request-id");
  req.requestId = isValidRequestId(suppliedId) ? suppliedId : randomUUID();
  res.set("X-Request-Id", req.requestId);
  next();
}

function isValidRequestId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9._-]{1,100}$/.test(value);
}
