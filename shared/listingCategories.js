export const ALL_LISTINGS_CATEGORY = "All";

export const LISTING_CATEGORY_DEFINITIONS = Object.freeze([
  Object.freeze({ id: 1, label: "Furniture" }),
  Object.freeze({ id: 2, label: "Electronics" }),
  Object.freeze({ id: 3, label: "Clothing" }),
  Object.freeze({ id: 4, label: "Food" }),
  Object.freeze({ id: 5, label: "Sports" }),
  Object.freeze({ id: 6, label: "Other" }),
]);

const categoryById = new Map(
  LISTING_CATEGORY_DEFINITIONS.map((category) => [category.id, category])
);
const categoryByLabel = new Map(
  LISTING_CATEGORY_DEFINITIONS.map((category) => [category.label.toLowerCase(), category])
);

export function getListingCategoryDefinition(id) {
  return categoryById.get(Number(id)) || null;
}

export function getListingCategoryByLabel(label) {
  return categoryByLabel.get(String(label || "").trim().toLowerCase()) || null;
}

export function getCanonicalListingCategoryLabel(id, fallbackLabel) {
  return (
    getListingCategoryDefinition(id)?.label ||
    String(fallbackLabel || "").trim() ||
    "Marketplace"
  );
}
