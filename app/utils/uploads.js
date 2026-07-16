const MIME_TYPES = Object.freeze({
  png: "image/png",
  webp: "image/webp",
});

export function getUploadFile(uri, fallbackName) {
  const asset = typeof uri === "string" ? { uri } : uri || {};
  const path = String(asset.uri || "");
  const cleanPath = path.split(/[?#]/)[0];
  const name = asset.fileName || cleanPath.split("/").pop() || fallbackName;
  const extension = name.split(".").pop()?.toLowerCase();
  const type = asset.mimeType || MIME_TYPES[extension] || "image/jpeg";

  if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(type)) {
    throw new Error("Please choose a JPEG, PNG, or WebP image.");
  }

  return {
    name,
    type,
    uri: path,
  };
}
