import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env, getAllowedOrigins } from "./config/environment.js";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: env.betterAuthUrl,
  trustedOrigins: (request) =>
    getAllowedOrigins(
      request?.headers?.get("origin") || request?.headers?.get("referer")
    ),
});
