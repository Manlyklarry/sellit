const DEFAULT_API_HOST = "127.0.0.1";
const DEFAULT_API_PORT = "8000";
const DEFAULT_EXPO_PORTS = ["8081", "19006"];

export const env = {
  apiHost: process.env.HOST || DEFAULT_API_HOST,
  apiPort: process.env.PORT || DEFAULT_API_PORT,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  corsOrigins: getCorsOrigins(),
  expoPushUrl:
    process.env.EXPO_PUSH_URL || "https://exp.host/--/api/v2/push/send",
};

export function getAllowedOrigins(originHeader) {
  const expoOrigin = getExpoDevOrigin(originHeader);

  return expoOrigin
    ? [...new Set([...env.corsOrigins, expoOrigin])]
    : env.corsOrigins;
}

export function isAllowedOrigin(origin) {
  return env.corsOrigins.includes(origin) || isExpoDevOrigin(origin);
}

function getCorsOrigins() {
  const configuredOrigins = parseOrigins(process.env.CORS_ORIGIN);

  if (configuredOrigins.length) {
    return configuredOrigins;
  }

  return DEFAULT_EXPO_PORTS.flatMap((port) => [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`,
  ]);
}

function parseOrigins(value) {
  return value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
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
