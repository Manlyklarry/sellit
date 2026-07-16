import AsyncStorage from "@react-native-async-storage/async-storage";

import { CACHE_DEFAULTS } from "../config/constants";

const cachePrefix = "sellit-cache:";

async function get(key, { maxAgeMs } = {}) {
  try {
    const value = await AsyncStorage.getItem(getCacheKey(key));
    if (!value) return null;

    const item = JSON.parse(value);
    const expired =
      typeof maxAgeMs === "number" &&
      (!item?.timestamp || Date.now() - item.timestamp > maxAgeMs);
    if (item?.version !== CACHE_DEFAULTS.version || expired) {
      await AsyncStorage.removeItem(getCacheKey(key));
      return null;
    }
    return item?.data ?? null;
  } catch {
    return null;
  }
}

async function store(key, data) {
  const item = {
    data,
    timestamp: Date.now(),
    version: CACHE_DEFAULTS.version,
  };

  await AsyncStorage.setItem(getCacheKey(key), JSON.stringify(item));
}

function getCacheKey(key) {
  return `${cachePrefix}${key}`;
}

export default {
  get,
  store,
};
