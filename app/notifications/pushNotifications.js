import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushToken, unregisterPushToken } from "../api/notifications";
import { APP_STORAGE_KEYS } from "../config/constants";

const listingsChannelId = "listings";
const listingsChannelName = "Listings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(listingsChannelId, {
      name: listingsChannelName,
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });
  }

  const permission = await getNotificationPermission();
  if (!permission) return null;

  const token = await getExpoPushToken();

  await registerPushToken({
    platform: Platform.OS,
    token,
  });
  await AsyncStorage.setItem(APP_STORAGE_KEYS.pushToken, token);

  return token;
}

export async function unregisterCurrentPushToken() {
  const token = await AsyncStorage.getItem(APP_STORAGE_KEYS.pushToken);
  if (!token) return;

  await unregisterPushToken(token);
  await AsyncStorage.removeItem(APP_STORAGE_KEYS.pushToken);
}

export async function hasRegisteredPushToken() {
  return Boolean(await AsyncStorage.getItem(APP_STORAGE_KEYS.pushToken));
}

async function getNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function getExpoPushToken() {
  const projectId =
    Constants.easConfig?.projectId || Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    throw new Error("Push notifications require an EAS project ID.");
  }
  const token = await Notifications.getExpoPushTokenAsync({ projectId });

  return token.data;
}
