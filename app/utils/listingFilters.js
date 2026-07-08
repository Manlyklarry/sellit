const categoryAliases = {
  Clothing: "Style",
};

export function filterListings(listings, { query, selectedCategory }) {
  return listings.filter(
    (listing) =>
      matchesSearch(listing, query) &&
      matchesCategory(listing, selectedCategory)
  );
}

export function getListingCategory(listing) {
  const category =
    listing.category?.label || listing.categoryLabel || listing.categoryName;

  return categoryAliases[category] || category || "Marketplace";
}

function matchesSearch(listing, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return getSearchableListingText(listing).includes(normalizedQuery);
}

function matchesCategory(listing, selectedCategory) {
  if (selectedCategory === "All") return true;

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
