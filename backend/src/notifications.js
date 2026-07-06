const expoPushUrl = "https://exp.host/--/api/v2/push/send";

export async function sendPushNotifications(messages) {
  const pushMessages = messages.filter((message) => isExpoPushToken(message.to));
  if (!pushMessages.length) return;

  const response = await fetch(expoPushUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pushMessages),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Expo push notification request failed", response.status, text);
  }
}

export function isExpoPushToken(token) {
  return /^Expo(nent)?PushToken\[[\w-]+\]$/.test(token || "");
}
