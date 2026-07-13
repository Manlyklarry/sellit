export function parseJsonField(value) {
  if (!value || value === "null") return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
