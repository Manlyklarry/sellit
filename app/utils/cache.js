import AsyncStorage from "@react-native-async-storage/async-storage";

const cachePrefix = "sellit-cache:";

async function get(key) {
  try {
    const value = await AsyncStorage.getItem(getCacheKey(key));
    if (!value) return null;

    const item = JSON.parse(value);
    return item?.data ?? null;
  } catch {
    return null;
  }
}

async function store(key, data) {
  const item = {
    data,
    timestamp: Date.now(),
  };

  await AsyncStorage.setItem(getCacheKey(key), JSON.stringify(item));
}

async function remove(key) {
  await AsyncStorage.removeItem(getCacheKey(key));
}

function getCacheKey(key) {
  return `${cachePrefix}${key}`;
}

export default {
  get,
  remove,
  store,
};
