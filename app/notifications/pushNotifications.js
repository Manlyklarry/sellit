import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { registerPushToken, unregisterPushToken } from "../api/notifications";

const registeredPushTokenKey = "sellit-expo-push-token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(user) {
  if (!user) return null;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("listings", {
        name: "Listings",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: "default",
      });
    }

    const permission = await getNotificationPermission();
    if (!permission) return null;

    const token = await getExpoPushToken();
    if (!token) return null;

    await registerPushToken({
      platform: Platform.OS,
      token,
      user,
    });
    await AsyncStorage.setItem(registeredPushTokenKey, token);

    return token;
  } catch (error) {
    console.log("Push notification registration failed", error.message);
    return null;
  }
}

export async function unregisterCurrentPushToken() {
  try {
    const token = await AsyncStorage.getItem(registeredPushTokenKey);
    if (!token) return;

    await unregisterPushToken(token);
    await AsyncStorage.removeItem(registeredPushTokenKey);
  } catch (error) {
    console.log("Push notification unregister failed", error.message);
  }
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
  const options = projectId ? { projectId } : undefined;
  const token = await Notifications.getExpoPushTokenAsync(options);

  return token.data;
}
