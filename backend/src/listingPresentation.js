import { LISTING_FALLBACKS } from "../../shared/listingValidation.js";

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
    sellerEmail: listing.seller?.email || listing.sellerEmail,
    sellerImage: listing.seller?.image || null,
    sellerName: listing.seller?.name || listing.sellerName,
    sellerUsername: listing.seller?.username || null,
    sellerUserId: listing.sellerUserId,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images,
    imageUrl: images[0]?.url || null,
  };
}

export function normalizeListingDescription(description) {
  const value = String(description || "").trim();

  return value || LISTING_FALLBACKS.description;
}

export function normalizeListingTitle(title) {
  const value = String(title || "").replace(/\s+/g, " ").trim();

  return value || LISTING_FALLBACKS.title;
}
