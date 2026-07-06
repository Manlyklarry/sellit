import api from "../config/api";
import { clearCurrentUser, saveCurrentUser } from "../auth/session";
import {
  registerForPushNotifications,
  unregisterCurrentPushToken,
} from "../notifications/pushNotifications";

const authBaseUrl = `${api.baseUrl}/api/auth`;
const requestTimeout = 10000;

async function authRequest(path, { body, method = "POST" } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeout);

  try {
    const response = await fetch(`${authBaseUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Origin: api.origin,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    const data = parseResponse(text);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Authentication failed.");
    }

    return data;
  } catch (error) {
    if (error.name !== "AbortError") {
      throw error;
    }

    throw new Error(
      `Could not reach the backend at ${api.baseUrl}. Make sure npm run backend:dev is running and this device is on the same network.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function signUp({ email, name, password }) {
  return authenticate("/sign-up/email", {
    body: {
      email,
      name,
      password,
    },
    fallbackUser: {
      email,
      name,
    },
  });
}

export function signIn({ email, password }) {
  return authenticate("/sign-in/email", {
    body: {
      email,
      password,
    },
    fallbackUser: {
      email,
    },
  });
}

export async function signOut() {
  try {
    return await authRequest("/sign-out");
  } finally {
    await unregisterCurrentPushToken();
    await clearCurrentUser();
  }
}

async function authenticate(path, { fallbackUser, ...options }) {
  const data = await authRequest(path, options);
  const user = await saveCurrentUser(getUserFromResponse(data) || fallbackUser);

  registerForPushNotifications(user);

  return data;
}

function getUserFromResponse(data) {
  return data?.user || data?.data?.user || null;
}

function parseResponse(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
