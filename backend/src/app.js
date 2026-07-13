import "dotenv/config";

import path from "node:path";

import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import { isAllowedOrigin } from "./config/environment.js";
import { ROUTES } from "./config/routes.js";
import { checkDatabaseConnection } from "./db.js";
import listingsRouter from "./routes/listings.js";
import pushTokensRouter from "./routes/pushTokens.js";
import usersRouter from "./routes/users.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
    })
  );

  app.all(ROUTES.auth, toNodeHandler(auth));

  app.use(express.json());
  app.use(ROUTES.uploads, express.static(path.join(process.cwd(), "uploads")));

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

  app.use(ROUTES.listings, listingsRouter);
  app.use(ROUTES.pushTokens, pushTokensRouter);
  app.use(ROUTES.users, usersRouter);

  app.use((_req, res) => {
    res.status(404).json({
      ok: false,
      error: "Route not found",
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);

    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    res.status(status).json({
      ok: false,
      error: status < 500 ? error.message : "Internal server error",
    });
  });

  return app;
}
