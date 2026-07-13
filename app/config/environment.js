import Constants from "expo-constants";
import { Platform } from "react-native";

import { DEVELOPMENT_HOSTS, NETWORK_DEFAULTS } from "./constants";
import { normalizeBaseUrl } from "../utils/urls";

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl, "EXPO_PUBLIC_API_URL");
  }

  const host = getExpoHost();
  const backendPort = process.env.EXPO_PUBLIC_API_PORT || NETWORK_DEFAULTS.apiPort;

  if (host) {
    return `http://${host}:${backendPort}`;
  }

  if (Platform.OS === "android") {
    return createDevelopmentUrl(DEVELOPMENT_HOSTS.androidEmulator, backendPort);
  }

  return createDevelopmentUrl(DEVELOPMENT_HOSTS.loopback, backendPort);
}

export function getAppOrigin() {
  const configuredOrigin = process.env.EXPO_PUBLIC_APP_ORIGIN;

  if (configuredOrigin) {
    return normalizeBaseUrl(configuredOrigin, "EXPO_PUBLIC_APP_ORIGIN");
  }

  const host = getExpoHost();
  const expoPort = process.env.EXPO_PUBLIC_EXPO_PORT || NETWORK_DEFAULTS.expoPort;

  if (host) {
    return `http://${host}:${expoPort}`;
  }

  return createDevelopmentUrl(DEVELOPMENT_HOSTS.localhost, expoPort);
}

function createDevelopmentUrl(host, port) {
  return `http://${host}:${port}`;
}

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.platform?.hostUri;

  return hostUri?.split(":")[0] || null;
}
