import { clearCurrentUser, saveCurrentUser } from "../auth/session";
import { unregisterCurrentPushToken } from "../notifications/pushNotifications";
import { publishAuthenticationState } from "../auth/authEvents";
import { API_ENDPOINTS } from "./endpoints";
import client from "./client";

export function signUp({ email, name, password }) {
  return authenticate(API_ENDPOINTS.auth.signUpEmail, {
    payload: {
      email,
      name,
      password,
    },
  });
}

export function signIn({ email, password }) {
  return authenticate(API_ENDPOINTS.auth.signInEmail, {
    payload: {
      email,
      password,
    },
  });
}

export async function signOut() {
  await unregisterCurrentPushToken().catch(() => null);
  try {
    return await client.postJson(API_ENDPOINTS.auth.signOut);
  } finally {
    await clearCurrentUser();
    publishAuthenticationState(null);
  }
}

export async function verifyCurrentSession() {
  const data = await client.get(API_ENDPOINTS.auth.getSession);
  const user = getUserFromResponse(data);

  if (!user?.id) {
    await clearCurrentUser();
    publishAuthenticationState(null);
    return null;
  }

  const savedUser = await saveCurrentUser(user);
  publishAuthenticationState(savedUser);
  return savedUser;
}

async function authenticate(path, { payload }) {
  const data = await client.postJson(path, payload);
  const responseUser = getUserFromResponse(data);
  if (!responseUser?.id) {
    throw new Error("Authentication succeeded without a valid user session.");
  }

  const user = await saveCurrentUser(responseUser);
  publishAuthenticationState(user);

  return data;
}

function getUserFromResponse(data) {
  return data?.user || data?.data?.user || null;
}
