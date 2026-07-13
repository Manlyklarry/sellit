import NetInfo from "@react-native-community/netinfo";

import api from "../config/api";
import { CACHE_KEYS, UPLOAD_DEFAULTS } from "../config/constants";
import cache from "../utils/cache";
import { toAbsoluteUrl } from "../utils/urls";
import { getUploadFile } from "../utils/uploads";
import { LISTING_FALLBACKS } from "../../shared/listingValidation";
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
    description: normalizeListingDescription(listing.description),
    title: normalizeListingTitle(listing.title),
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

function normalizeListingDescription(description) {
  const value = String(description || "").trim();

  return value || LISTING_FALLBACKS.description;
}

function normalizeListingTitle(title) {
  const value = String(title || "").replace(/\s+/g, " ").trim();

  return value || LISTING_FALLBACKS.title;
}

export async function getListings() {
  const cachedListings = await getCachedListings();
  const networkState = await NetInfo.fetch();

  if (isOffline(networkState) && cachedListings) {
    return {
      data: cachedListings,
      stale: true,
    };
  }

  try {
    const data = await client.get(API_ENDPOINTS.listings.root);
    const listings = (data?.listings || []).map(normalizeListing);

    await cacheListings(listings);

    return {
      data: listings,
      stale: false,
    };
  } catch (error) {
    if (cachedListings) {
      return {
        data: cachedListings,
        error,
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

export async function deleteListing(id, user) {
  await client.delete(API_ENDPOINTS.listings.byId(id), {
    body: {
      user,
    },
  });
  await removeCachedListing(id);
}

export async function removeCachedListing(id) {
  const cachedListings = await getCachedListings();
  if (!cachedListings) return;

  await cacheListings(cachedListings.filter((listing) => listing.id !== id));
}

async function getCachedListings() {
  return cache.get(CACHE_KEYS.listings);
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

export function addListing(listing, onUploadProgress) {
  const formData = client.createFormData({
    title: normalizeListingTitle(listing.title),
    price: listing.price,
    category: listing.category,
    description: listing.description,
    location: listing.location,
    seller: listing.seller,
  });

  listing.images.forEach((uri, index) => {
    formData.append(
      "images",
      getUploadFile(uri, `listing-${index + 1}-${UPLOAD_DEFAULTS.listingFileName}`)
    );
  });

  return client.postMultipart(
    API_ENDPOINTS.listings.root,
    formData,
    onUploadProgress
  );
}
