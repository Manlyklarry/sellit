import AsyncStorage from "@react-native-async-storage/async-storage";

const SELLING_TYPE_KEY = "sellit.onboarding.selling-type";

export async function getSellingType() {
  try {
    const value = await AsyncStorage.getItem(SELLING_TYPE_KEY);
    return value === "new" || value === "preowned" ? value : null;
  } catch {
    return null;
  }
}

export async function saveSellingType(value) {
  if (value !== "new" && value !== "preowned") return;
  await AsyncStorage.setItem(SELLING_TYPE_KEY, value);
}
