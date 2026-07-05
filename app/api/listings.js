import client from "./client";

function getFileName(uri, index) {
  const name = uri.split("/").pop();
  return name || `listing-${index + 1}.jpg`;
}

function getMimeType(uri) {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}

export function addListing(listing, onUploadProgress) {
  const formData = client.createFormData({
    title: listing.title,
    price: listing.price,
    category: listing.category,
    description: listing.description,
    location: listing.location,
  });

  listing.images.forEach((uri, index) => {
    formData.append("images", {
      uri,
      name: getFileName(uri, index),
      type: getMimeType(uri),
    });
  });

  return client.postMultipart("/api/listings", formData, onUploadProgress);
}
