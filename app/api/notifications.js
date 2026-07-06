import client from "./client";

export function registerPushToken({ platform, token, user }) {
  return client.postJson("/api/push-tokens", {
    platform,
    token,
    user,
  });
}

export function unregisterPushToken(token) {
  return client.delete(`/api/push-tokens/${encodeURIComponent(token)}`);
}

export function sendListingInquiry({ listingId, message, user }) {
  return client.postJson(`/api/listings/${listingId}/inquiries`, {
    buyer: user,
    message,
  });
}
