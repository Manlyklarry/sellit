export function normalizeBaseUrl(value, label = "URL") {
  const normalized = String(value || "").trim().replace(/\/+$/, "");

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    throw new Error(`${label} must be a valid HTTP or HTTPS URL.`);
  }
}

export function toAbsoluteUrl(value, baseUrl) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  return `${baseUrl}${value.startsWith("/") ? "" : "/"}${value}`;
}
