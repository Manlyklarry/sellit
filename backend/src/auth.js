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
  trustedOrigins: parseOrigins(process.env.CORS_ORIGIN, [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
    "http://192.168.137.62:8081",
    "http://192.168.43.101:8081",
  ]),
});

function parseOrigins(value, defaults = []) {
  const origins = value
    ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaults, ...origins])];
}
