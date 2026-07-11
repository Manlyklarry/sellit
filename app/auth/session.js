import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../config/api";

const currentUserKey = "sellit-current-user";

export async function clearCurrentUser() {
  await AsyncStorage.removeItem(currentUserKey);
}

export async function getCurrentUser() {
  try {
    const value = await AsyncStorage.getItem(currentUserKey);
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

  await AsyncStorage.setItem(currentUserKey, JSON.stringify(currentUser));
  return currentUser;
}

function normalizeImageUrl(image) {
  if (!image) return null;

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${api.baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}
