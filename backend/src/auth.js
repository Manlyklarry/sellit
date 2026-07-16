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
    minPasswordLength: 8,
  },
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  trustedOrigins: (request) =>
    getAllowedOrigins(
      request?.headers?.get("origin") || request?.headers?.get("referer")
    ),
});
