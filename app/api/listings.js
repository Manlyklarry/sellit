import NetInfo from "@react-native-community/netinfo";

import api from "../config/api";
import {
  CACHE_DEFAULTS,
  CACHE_KEYS,
  LISTING_PAGE_SIZE,
  UPLOAD_DEFAULTS,
} from "../config/constants";
import cache from "../utils/cache";
import { toAbsoluteUrl } from "../utils/urls";
import { getUploadFile } from "../utils/uploads";
import {
  getListingDisplayDescription,
  getListingDisplayTitle,
  normalizeListingText,
} from "../../shared/listingValidation";
import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

function getImageUrl(listing) {
  const path = listing.imageUrl || listing.images?.[0]?.url;
  return toAbsoluteUrl(path, api.baseUrl);
}

function normalizeListing(listing) {
  const imageUrl = getImageUrl(listing);

  return {
    ...listing,
    description: getListingDisplayDescription(listing.description),
    title: getListingDisplayTitle(listing.title),
    price: Number(listing.price),
    image: imageUrl ? { uri: imageUrl } : null,
    sellerDisplayName:
      listing.sellerUsername || listing.sellerName || "Local seller",
    sellerImage: toAbsoluteUrl(listing.sellerImage, api.baseUrl),
    sellerImageSource: listing.sellerImage
      ? { uri: toAbsoluteUrl(listing.sellerImage, api.baseUrl) }
      : null,
  };
}

export async function getListings({ categoryId, cursor, search } = {}) {
  const cacheable = !cursor && !categoryId && !String(search || "").trim();
  const cachedListings = await getCachedListings();
  const networkState = await NetInfo.fetch();

  if (isOffline(networkState) && cachedListings) {
    return {
      data: cachedListings,
      stale: true,
    };
  }

  try {
    const data = await client.get(
      createListingsEndpoint({ categoryId, cursor, search })
    );
    const listings = (data?.listings || []).map(normalizeListing);

    if (cacheable) await cacheListings(listings);

    return {
      data: listings,
      nextCursor: data?.nextCursor || null,
      stale: false,
    };
  } catch (error) {
    if (cachedListings) {
      return {
        data: cachedListings,
        error,
        nextCursor: null,
        stale: true,
      };
    }

    throw error;
  }
}

export async function getListing(id) {
  const data = await client.get(API_ENDPOINTS.listings.byId(id));
  return data?.listing ? normalizeListing(data.listing) : null;
}

export async function deleteListing(id) {
  await client.delete(API_ENDPOINTS.listings.byId(id));
  await removeCachedListing(id);
}

export async function removeCachedListing(id) {
  const cachedListings = await getCachedListings();
  if (!cachedListings) return;

  await cacheListings(cachedListings.filter((listing) => listing.id !== id));
}

async function getCachedListings() {
  return cache.get(CACHE_KEYS.listings, {
    maxAgeMs: CACHE_DEFAULTS.listingsMaxAgeMs,
  });
}

async function cacheListings(listings) {
  await cache.store(CACHE_KEYS.listings, listings);
}

function isOffline(networkState) {
  return (
    networkState.isConnected === false ||
    networkState.isInternetReachable === false
  );
}

function createListingsEndpoint({ categoryId, cursor, search }) {
  const params = new URLSearchParams({ limit: String(LISTING_PAGE_SIZE) });
  if (categoryId) params.set("category", String(categoryId));
  if (cursor) params.set("cursor", cursor);
  if (String(search || "").trim()) params.set("search", String(search).trim());
  return `${API_ENDPOINTS.listings.root}?${params.toString()}`;
}

export function addListing(listing, onUploadProgress, options) {
  const formData = client.createFormData({
    title: normalizeListingText(listing.title),
    price: listing.price,
    category: listing.category,
    description: listing.description,
    location: listing.location,
  });

  listing.images.forEach((image, index) => {
    formData.append(
      "images",
      getUploadFile(image, `listing-${index + 1}-${UPLOAD_DEFAULTS.listingFileName}`)
    );
  });

  return client.postMultipart(
    API_ENDPOINTS.listings.root,
    formData,
    onUploadProgress,
    options
  );
}
