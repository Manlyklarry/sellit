import {
  ALL_LISTINGS_CATEGORY,
  getCanonicalListingCategoryLabel,
} from "../../shared/listingCategories";

export function filterListings(listings, { query, selectedCategory }) {
  return listings.filter(
    (listing) =>
      matchesSearch(listing, query) &&
      matchesCategory(listing, selectedCategory)
  );
}

export function getListingCategory(listing) {
  return getCanonicalListingCategoryLabel(
    listing.category?.value ?? listing.categoryId,
    listing.category?.label || listing.categoryLabel || listing.categoryName
  );
}

function matchesSearch(listing, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return getSearchableListingText(listing).includes(normalizedQuery);
}

function matchesCategory(listing, selectedCategory) {
  if (selectedCategory === ALL_LISTINGS_CATEGORY) return true;

  return getListingCategory(listing) === selectedCategory;
}

function getSearchableListingText(listing) {
  return [
    listing.title,
    listing.description,
    getListingCategory(listing),
    listing.location?.address,
    listing.sellerName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
