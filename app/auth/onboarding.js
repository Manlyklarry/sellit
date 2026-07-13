import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_STORAGE_KEYS } from "../config/constants";

export async function getSellingType() {
  try {
    const value = await AsyncStorage.getItem(APP_STORAGE_KEYS.onboardingSellingType);
    return value === "new" || value === "preowned" ? value : null;
  } catch {
    return null;
  }
}

export async function saveSellingType(value) {
  if (value !== "new" && value !== "preowned") return;
  await AsyncStorage.setItem(APP_STORAGE_KEYS.onboardingSellingType, value);
}
