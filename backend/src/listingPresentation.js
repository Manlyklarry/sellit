const placeholderTitleWords = /\b(test|testing|sample|placeholder|upload|delete)\b/gi;
const placeholderDescriptionPattern = /\b(test|testing|sample|placeholder|endpoint)\b/i;
const fallbackDescription =
  "A local marketplace item in good condition. Message the seller to confirm availability and pickup details.";

export function formatListing(listing) {
  const images = listing.images.map((image) => ({
    id: image.id,
    filename: image.filename,
    mimetype: image.mimetype,
    size: image.size,
    url: `/uploads/listings/${image.filename}`,
  }));

  return {
    id: listing.id,
    title: normalizeListingTitle(listing.title),
    price: listing.price.toString(),
    categoryId: listing.categoryId,
    categoryLabel: listing.categoryLabel,
    description: normalizeListingDescription(listing.description),
    location: listing.location,
    sellerEmail: listing.sellerEmail,
    sellerName: listing.sellerName,
    sellerUserId: listing.sellerUserId,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images,
    imageUrl: images[0]?.url || null,
  };
}

export function normalizeListingDescription(description) {
  const value = String(description || "").trim();

  if (!value || placeholderDescriptionPattern.test(value)) {
    return fallbackDescription;
  }

  return value;
}

export function normalizeListingTitle(title) {
  const originalTitle = String(title || "").trim();
  const cleanedTitle = originalTitle
    .replace(placeholderTitleWords, "")
    .replace(/\blisting\b/gi, "item")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedTitle || /^item$/i.test(cleanedTitle)) {
    return "Marketplace item";
  }

  return cleanedTitle;
}
