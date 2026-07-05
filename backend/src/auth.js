import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins,
});

const defaultTrustedOrigins = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:19006",
  "http://127.0.0.1:19006",
];

function getTrustedOrigins(request) {
  const originHeader =
    request?.headers?.get("origin") || request?.headers?.get("referer");
  const trustedOrigins = parseOrigins(
    process.env.CORS_ORIGIN,
    defaultTrustedOrigins
  );
  const expoOrigin = getExpoDevOrigin(originHeader);

  return expoOrigin
    ? [...new Set([...trustedOrigins, expoOrigin])]
    : trustedOrigins;
}

function parseOrigins(value, defaults = []) {
  const origins = value
    ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaults, ...origins])];
}

function getExpoDevOrigin(value) {
  if (!value) return null;

  try {
    const origin = new URL(value).origin;
    return isExpoDevOrigin(origin) ? origin : null;
  } catch {
    return null;
  }
}

function isExpoDevOrigin(origin) {
  return /^http:\/\/(10|172\.(1[6-9]|2\d|3[0-1])|192\.168)\.\d{1,3}\.\d{1,3}:(8081|19006)$/.test(
    origin
  );
}
