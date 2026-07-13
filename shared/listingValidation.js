export const LISTING_LIMITS = Object.freeze({
  descriptionMax: 500,
  descriptionMin: 10,
  imageMax: 6,
  priceMin: 1,
  titleMax: 80,
  titleMin: 3,
});

export const LISTING_FALLBACKS = Object.freeze({
  description: "Message the seller to confirm availability and pickup details.",
  title: "Marketplace item",
});

export function normalizeListingText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function validateListingTitle(value) {
  const title = normalizeListingText(value);
  if (title.length < LISTING_LIMITS.titleMin) {
    return `Name of item must be at least ${LISTING_LIMITS.titleMin} characters.`;
  }
  if (title.length > LISTING_LIMITS.titleMax) {
    return `Name of item must be ${LISTING_LIMITS.titleMax} characters or less.`;
  }
  return null;
}

export function validateListingDescription(value) {
  const description = normalizeListingText(value);
  if (description.length < LISTING_LIMITS.descriptionMin) {
    return `Description must be at least ${LISTING_LIMITS.descriptionMin} characters.`;
  }
  if (description.length > LISTING_LIMITS.descriptionMax) {
    return `Description must be ${LISTING_LIMITS.descriptionMax} characters or less.`;
  }
  return null;
}
