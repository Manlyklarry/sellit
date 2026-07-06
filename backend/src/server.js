import "dotenv/config";

import path from "node:path";

import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";
import { checkDatabaseConnection } from "./db.js";
import listingsRouter from "./routes/listings.js";

const app = express();
const port = process.env.PORT || 8000;
const host = process.env.HOST || "127.0.0.1";
const corsOrigins = parseOrigins(process.env.CORS_ORIGIN, [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:19006",
  "http://127.0.0.1:19006",
  "http://192.168.137.62:8081",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin) || isExpoDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", async (_req, res, next) => {
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

app.use("/api/listings", listingsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    ok: false,
    error: "Internal server error",
  });
});

const server = app.listen(port, host, () => {
  console.log(`Sellit backend listening on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start backend server", error);
  process.exit(1);
});

function parseOrigins(value, defaults = []) {
  const origins = value
    ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaults, ...origins])];
}

function isExpoDevOrigin(origin) {
  return /^http:\/\/(10|172\.(1[6-9]|2\d|3[0-1])|192\.168)\.\d{1,3}\.\d{1,3}:(8081|19006)$/.test(
    origin
  );
}
