import "dotenv/config";

import path from "node:path";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import { env, isAllowedOrigin } from "./config/environment.js";
import { ROUTES } from "./config/routes.js";
import { checkDatabaseConnection } from "./db.js";
import { attachAuthenticatedUser } from "./http/authentication.js";
import {
  apiRateLimit,
  attachRequestId,
  authRateLimit,
} from "./http/security.js";
import listingsRouter from "./routes/listings.js";
import pushTokensRouter from "./routes/pushTokens.js";
import usersRouter from "./routes/users.js";

export function createApp({ resolveAuthenticatedUser } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.trustProxy);
  app.use(attachRequestId);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(
          Object.assign(new Error("CORS origin not allowed."), { statusCode: 403 })
        );
      },
      credentials: true,
    })
  );

  app.all(ROUTES.auth, authRateLimit, toNodeHandler(auth));

  app.use(express.json({ limit: "100kb" }));
  app.use(attachAuthenticatedUser(resolveAuthenticatedUser));
  app.use(
    ROUTES.uploads,
    express.static(path.join(process.cwd(), "uploads"), {
      fallthrough: false,
      immutable: true,
      maxAge: "30d",
      setHeaders(res) {
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );

  app.get(ROUTES.health, async (_req, res, next) => {
    try {
      const database = await checkDatabaseConnection();

      res.json({
        ok: true,
        database,
        service: "sellit-backend",
      });
    } catch (error) {
      next(error);
    }
  });

  app.use(ROUTES.listings, apiRateLimit, listingsRouter);
  app.use(ROUTES.pushTokens, apiRateLimit, pushTokensRouter);
  app.use(ROUTES.users, apiRateLimit, usersRouter);

  app.use((_req, res) => {
    res.status(404).json({
      ok: false,
      error: "Route not found",
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(JSON.stringify({
      error: error.message,
      requestId: _req.requestId,
      stack: env.isProduction ? undefined : error.stack,
    }));

    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    res.status(status).json({
      ok: false,
      error:
        status === 404
          ? "Resource not found."
          : status < 500
            ? error.message
            : "Internal server error",
    });
  });

  return app;
}
