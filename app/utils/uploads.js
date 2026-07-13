const MIME_TYPES = Object.freeze({
  png: "image/png",
  webp: "image/webp",
});

export function getUploadFile(uri, fallbackName) {
  const path = String(uri || "");
  const name = path.split("/").pop() || fallbackName;
  const extension = path.split(".").pop()?.toLowerCase();

  return {
    name,
    type: MIME_TYPES[extension] || "image/jpeg",
    uri,
  };
}
