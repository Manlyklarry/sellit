import { getApiBaseUrl, getAppOrigin } from "./environment";

const api = {
  baseUrl: getApiBaseUrl(),
  origin: getAppOrigin(),
};

export default api;
