import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_BACKEND_PORT = "8000";
const DEFAULT_EXPO_PORT = "8081";

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl);
  }

  const host = getExpoHost();
  const backendPort = process.env.EXPO_PUBLIC_API_PORT || DEFAULT_BACKEND_PORT;

  if (host) {
    return `http://${host}:${backendPort}`;
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${backendPort}`;
  }

  return `http://127.0.0.1:${backendPort}`;
}

export function getAppOrigin() {
  const configuredOrigin = process.env.EXPO_PUBLIC_APP_ORIGIN;

  if (configuredOrigin) {
    return trimTrailingSlash(configuredOrigin);
  }

  const host = getExpoHost();
  const expoPort = process.env.EXPO_PUBLIC_EXPO_PORT || DEFAULT_EXPO_PORT;

  if (host) {
    return `http://${host}:${expoPort}`;
  }

  return `http://localhost:${expoPort}`;
}

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.platform?.hostUri;

  return hostUri?.split(":")[0] || null;
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}
