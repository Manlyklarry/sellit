import {
  getListingDisplayDescription,
  getListingDisplayTitle,
} from "../../shared/listingValidation.js";
import { getCanonicalListingCategoryLabel } from "../../shared/listingCategories.js";

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
    title: getListingDisplayTitle(listing.title),
    price: listing.price.toString(),
    currency: listing.currency,
    status: listing.status,
    categoryId: listing.categoryId,
    categoryLabel: getCanonicalListingCategoryLabel(
      listing.categoryId,
      listing.categoryLabel
    ),
    description: getListingDisplayDescription(listing.description),
    location: listing.location,
    sellerImage: listing.seller?.image || null,
    sellerName: listing.seller?.name || null,
    sellerUsername: listing.seller?.username || null,
    sellerUserId: listing.sellerUserId,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images,
    imageUrl: images[0]?.url || null,
  };
}
