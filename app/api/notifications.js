import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

export function registerPushToken({ platform, token }) {
  return client.postJson(API_ENDPOINTS.pushTokens.root, {
    platform,
    token,
  });
}

export function unregisterPushToken(token) {
  return client.delete(API_ENDPOINTS.pushTokens.byToken(token));
}

export function sendListingInquiry({ listingId, message }) {
  return client.postJson(API_ENDPOINTS.listings.inquiries(listingId), {
    message,
  });
}
