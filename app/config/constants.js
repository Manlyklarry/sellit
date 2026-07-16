export const APP_STORAGE_KEYS = Object.freeze({
  currentUser: "sellit-current-user",
  onboardingSellingType: "sellit.onboarding.selling-type",
  pushToken: "sellit-expo-push-token",
  theme: "sellit.theme",
});

export const CACHE_KEYS = Object.freeze({
  listings: "listings",
});

export const CACHE_DEFAULTS = Object.freeze({
  listingsMaxAgeMs: 15 * 60 * 1000,
  version: 1,
});

export const LISTING_PAGE_SIZE = 20;

export const NETWORK_DEFAULTS = Object.freeze({
  apiPort: "8000",
  expoPort: "8081",
  requestTimeoutMs: 10_000,
  uploadTimeoutMs: 30_000,
});

export const DEVELOPMENT_HOSTS = Object.freeze({
  androidEmulator: "10.0.2.2",
  loopback: "127.0.0.1",
  localhost: "localhost",
});

export const UPLOAD_DEFAULTS = Object.freeze({
  listingFileName: "listing.jpg",
  profileFileName: "profile.jpg",
});

export const UI_TIMINGS = Object.freeze({
  feedEntranceMs: 420,
  mockRefreshMs: 900,
  uploadSuccessMs: 2_400,
});

export const MARKET_DEFAULTS = Object.freeze({
  currencyCode: process.env.EXPO_PUBLIC_CURRENCY_CODE || "GHS",
  locale: process.env.EXPO_PUBLIC_LOCALE || "en-GH",
});
