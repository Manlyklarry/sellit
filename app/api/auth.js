import { clearCurrentUser, saveCurrentUser } from "../auth/session";
import {
  registerForPushNotifications,
  unregisterCurrentPushToken,
} from "../notifications/pushNotifications";
import { API_ENDPOINTS } from "./endpoints";
import client from "./client";

export function signUp({ email, name, password }) {
  return authenticate(API_ENDPOINTS.auth.signUpEmail, {
    payload: {
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
  return authenticate(API_ENDPOINTS.auth.signInEmail, {
    payload: {
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
    return await client.postJson(API_ENDPOINTS.auth.signOut);
  } finally {
    await unregisterCurrentPushToken();
    await clearCurrentUser();
  }
}

async function authenticate(path, { fallbackUser, payload }) {
  const data = await client.postJson(path, payload);
  const user = await saveCurrentUser(getUserFromResponse(data) || fallbackUser);

  registerForPushNotifications(user);

  return data;
}

function getUserFromResponse(data) {
  return data?.user || data?.data?.user || null;
}
