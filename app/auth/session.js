import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../config/api";
import { APP_STORAGE_KEYS } from "../config/constants";
import { toAbsoluteUrl } from "../utils/urls";

export async function clearCurrentUser() {
  await AsyncStorage.removeItem(APP_STORAGE_KEYS.currentUser);
}

export async function getCurrentUser() {
  try {
    const value = await AsyncStorage.getItem(APP_STORAGE_KEYS.currentUser);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function saveCurrentUser(user) {
  if (!user) return null;

  const currentUser = {
    id: user.id || null,
    name: user.name || null,
    email: user.email || null,
    image: normalizeImageUrl(user.image),
    username: user.username || null,
  };

  await AsyncStorage.setItem(APP_STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  return currentUser;
}

function normalizeImageUrl(image) {
  if (!image) return null;

  return toAbsoluteUrl(image, api.baseUrl);
}
