import { env } from "./config/environment.js";

export async function sendPushNotifications(messages) {
  const pushMessages = messages.filter((message) => isExpoPushToken(message.to));
  if (!pushMessages.length || !env.expoPushUrl) return { invalidTokens: [] };

  const invalidTokens = [];
  for (let index = 0; index < pushMessages.length; index += 100) {
    const result = await sendPushBatch(pushMessages.slice(index, index + 100));
    invalidTokens.push(...result.invalidTokens);
  }

  return { invalidTokens };
}

async function sendPushBatch(pushMessages) {

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.pushRequestTimeoutMs);

  let response;
  try {
    response = await fetch(env.expoPushUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushMessages),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Push notification request failed (${response.status}): ${text}`
    );
  }

  const body = await response.json().catch(() => null);
  const tickets = Array.isArray(body?.data) ? body.data : [];
  return {
    invalidTokens: tickets.flatMap((ticket, index) =>
      ticket?.details?.error === "DeviceNotRegistered"
        ? [pushMessages[index]?.to].filter(Boolean)
        : []
    ),
  };
}

export function isExpoPushToken(token) {
  return /^Expo(nent)?PushToken\[[\w-]+\]$/.test(token || "");
}
