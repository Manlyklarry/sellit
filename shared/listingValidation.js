export const LISTING_LIMITS = Object.freeze({
  addressMax: 160,
  descriptionMax: 500,
  descriptionMin: 10,
  imageMax: 6,
  priceMin: 1,
  priceMax: 99_999_999.99,
  titleMax: 80,
  titleMin: 3,
});

export const INQUIRY_LIMITS = Object.freeze({
  messageMax: 500,
  messageMin: 2,
});

export const LISTING_FALLBACKS = Object.freeze({
  description: "Message the seller to confirm availability and pickup details.",
  title: "Marketplace item",
});

export function normalizeListingText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function getListingDisplayDescription(value) {
  return normalizeListingText(value) || LISTING_FALLBACKS.description;
}

export function getListingDisplayTitle(value) {
  return normalizeListingText(value) || LISTING_FALLBACKS.title;
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

export function normalizeListingLocation(value) {
  if (value === null || value === undefined) return null;

  return {
    address: normalizeListingText(value.address),
    latitude: Number(value.latitude),
    longitude: Number(value.longitude),
  };
}

export function validateListingLocation(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object" || Array.isArray(value)) {
    return "Location must be a valid location object.";
  }

  const location = normalizeListingLocation(value);
  if (!Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90) {
    return "Location latitude must be between -90 and 90.";
  }
  if (!Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) {
    return "Location longitude must be between -180 and 180.";
  }
  if (location.address.length > LISTING_LIMITS.addressMax) {
    return `Location address must be ${LISTING_LIMITS.addressMax} characters or less.`;
  }

  return null;
}

export function validateListingPrice(value) {
  const normalized = String(value ?? "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return "Price must be a number with no more than two decimal places.";
  }

  const price = Number(normalized);
  if (price < LISTING_LIMITS.priceMin || price > LISTING_LIMITS.priceMax) {
    return `Price must be between ${LISTING_LIMITS.priceMin} and ${LISTING_LIMITS.priceMax}.`;
  }

  return null;
}

export function validateInquiryMessage(value) {
  const message = normalizeListingText(value);
  if (message.length < INQUIRY_LIMITS.messageMin) {
    return `Message must be at least ${INQUIRY_LIMITS.messageMin} characters.`;
  }
  if (message.length > INQUIRY_LIMITS.messageMax) {
    return `Message must be ${INQUIRY_LIMITS.messageMax} characters or less.`;
  }
  return null;
}
