import { env } from "./config/environment.js";

export async function sendPushNotifications(messages) {
  const pushMessages = messages.filter((message) => isExpoPushToken(message.to));
  if (!pushMessages.length || !env.expoPushUrl) return;

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
}

export function isExpoPushToken(token) {
  return /^Expo(nent)?PushToken\[[\w-]+\]$/.test(token || "");
}
