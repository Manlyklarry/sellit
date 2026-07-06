import NetInfo from "@react-native-community/netinfo";

import api from "../config/api";
import cache from "../utils/cache";
import client from "./client";

const listingsCacheKey = "listings";

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

function normalizeListing(listing) {
  const imageUrl = getImageUrl(listing);

  return {
    ...listing,
    price: Number(listing.price),
    image: imageUrl ? { uri: imageUrl } : null,
  };
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
    const data = await client.get("/api/listings");
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

export async function deleteListing(id) {
  await client.delete(`/api/listings/${id}`);
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
    title: listing.title,
    price: listing.price,
    category: listing.category,
    description: listing.description,
    location: listing.location,
  });

  listing.images.forEach((uri, index) => {
    formData.append("images", {
      uri,
      name: getFileName(uri, index),
      type: getMimeType(uri),
    });
  });

  return client.postMultipart("/api/listings", formData, onUploadProgress);
}
