import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

export function registerPushToken({ platform, token, user }) {
  return client.postJson(API_ENDPOINTS.pushTokens.root, {
    platform,
    token,
    user,
  });
}

export function unregisterPushToken(token) {
  return client.delete(API_ENDPOINTS.pushTokens.byToken(token));
}

export function sendListingInquiry({ listingId, message, user }) {
  return client.postJson(API_ENDPOINTS.listings.inquiries(listingId), {
    buyer: user,
    message,
  });
}
