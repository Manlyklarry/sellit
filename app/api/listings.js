import NetInfo from "@react-native-community/netinfo";

import api from "../config/api";
import cache from "../utils/cache";
import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

const listingsCacheKey = "listings";
const fallbackDescription =
  "A local marketplace item in good condition. Message the seller to confirm availability and pickup details.";
const fallbackTitle = "Marketplace item";

function getFileName(uri, index) {
  const name = uri.split("/").pop();
  return name || `listing-${index + 1}.jpg`;
}

function getMimeType(uri) {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}

function getImageUrl(listing) {
  const path = listing.imageUrl || listing.images?.[0]?.url;
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${api.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getAssetUrl(path) {
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${api.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
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
    sellerImage: getAssetUrl(listing.sellerImage),
    sellerImageSource: listing.sellerImage
      ? { uri: getAssetUrl(listing.sellerImage) }
      : null,
  };
}

function normalizeListingDescription(description) {
  const value = String(description || "").trim();

  return value || fallbackDescription;
}

function normalizeListingTitle(title) {
  const value = String(title || "").replace(/\s+/g, " ").trim();

  return value || fallbackTitle;
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
  return cache.get(listingsCacheKey);
}

async function cacheListings(listings) {
  await cache.store(listingsCacheKey, listings);
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
    formData.append("images", {
      uri,
      name: getFileName(uri, index),
      type: getMimeType(uri),
    });
  });

  return client.postMultipart(
    API_ENDPOINTS.listings.root,
    formData,
    onUploadProgress
  );
}
