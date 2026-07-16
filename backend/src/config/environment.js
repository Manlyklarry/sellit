const DEFAULT_API_HOST = "127.0.0.1";
const DEFAULT_API_PORT = "8000";
const DEFAULT_EXPO_PORTS = ["8081", "19006"];
const DEFAULT_LISTING_IMAGE_LIMIT = 6;
const MEBIBYTE = 1024 * 1024;
const DEVELOPMENT_HOSTS = ["localhost", "127.0.0.1"];

export const env = {
  apiHost: process.env.HOST || DEFAULT_API_HOST,
  apiPort: process.env.PORT || DEFAULT_API_PORT,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL,
  corsOrigins: getCorsOrigins(),
  expoDevPorts: getExpoDevPorts(),
  expoPushUrl: process.env.EXPO_PUSH_URL || null,
  listingImageLimit: readPositiveInteger(
    "LISTING_IMAGE_LIMIT",
    DEFAULT_LISTING_IMAGE_LIMIT
  ),
  listingImageMaxBytes: readPositiveInteger(
    "LISTING_IMAGE_MAX_BYTES",
    8 * MEBIBYTE
  ),
  profileImageMaxBytes: readPositiveInteger(
    "PROFILE_IMAGE_MAX_BYTES",
    4 * MEBIBYTE
  ),
  pushRequestTimeoutMs: readPositiveInteger(
    "PUSH_REQUEST_TIMEOUT_MS",
    10_000
  ),
  databaseUrl: process.env.DATABASE_URL,
  marketCurrencyCode: readCurrencyCode(process.env.MARKET_CURRENCY_CODE || "GHS"),
  isProduction: process.env.NODE_ENV === "production",
  trustProxy: readTrustProxy(process.env.TRUST_PROXY),
};

validateProductionEnvironment();

export function getAllowedOrigins(originHeader) {
  const expoOrigin = env.isProduction ? null : getExpoDevOrigin(originHeader);

  return expoOrigin
    ? [...new Set([...env.corsOrigins, expoOrigin])]
    : env.corsOrigins;
}

export function isAllowedOrigin(origin) {
  return (
    env.corsOrigins.includes(origin) ||
    (!env.isProduction && isExpoDevOrigin(origin))
  );
}

function getCorsOrigins() {
  const configuredOrigins = parseOrigins(process.env.CORS_ORIGIN);

  if (configuredOrigins.length) {
    return configuredOrigins;
  }

  return getExpoDevPorts().flatMap((port) =>
    DEVELOPMENT_HOSTS.map((host) => `http://${host}:${port}`)
  );
}

function getExpoDevPorts() {
  const configuredPorts = parseList(process.env.EXPO_DEV_PORTS);
  return configuredPorts.length ? configuredPorts : DEFAULT_EXPO_PORTS;
}

function parseOrigins(value) {
  return parseList(value);
}

function parseList(value) {
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function readPositiveInteger(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

function readTrustProxy(value) {
  if (!value) return false;
  if (value === "true") return 1;
  if (value === "false") return false;

  const hops = Number(value);
  if (Number.isInteger(hops) && hops > 0) return hops;

  throw new Error("TRUST_PROXY must be false, true, or a positive integer.");
}

function readCurrencyCode(value) {
  const code = String(value).trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error("MARKET_CURRENCY_CODE must be a three-letter ISO currency code.");
  }
  return code;
}

function validateProductionEnvironment() {
  if (process.env.NODE_ENV !== "production") return;

  const required = ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "CORS_ORIGIN"];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(`Missing required production environment: ${missing.join(", ")}`);
  }
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
  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      isPrivateNetworkHost(url.hostname) &&
      env.expoDevPorts.includes(url.port)
    );
  } catch {
    return false;
  }
}

function isPrivateNetworkHost(hostname) {
  return /^(10\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])|192\.168)\.\d{1,3}\.\d{1,3}$/.test(
    hostname
  );
}
