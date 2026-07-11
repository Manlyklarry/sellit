const fallbackDescription =
  "A local marketplace item in good condition. Message the seller to confirm availability and pickup details.";
const fallbackTitle = "Marketplace item";

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

  return value || fallbackDescription;
}

export function normalizeListingTitle(title) {
  const value = String(title || "").replace(/\s+/g, " ").trim();

  return value || fallbackTitle;
}
