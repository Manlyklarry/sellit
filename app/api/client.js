import api from "../config/api";

const defaultTimeout = 10000;

function createFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    const isBlob = typeof Blob !== "undefined" && value instanceof Blob;
    const serializedValue =
      typeof value === "object" && !isBlob ? JSON.stringify(value) : value;

    formData.append(key, serializedValue);
  });

  return formData;
}

async function get(endpoint, { timeout = defaultTimeout } = {}) {
  return request(endpoint, { method: "GET", timeout });
}

async function del(endpoint, { timeout = defaultTimeout } = {}) {
  return request(endpoint, { method: "DELETE", timeout });
}

async function request(endpoint, { method, timeout = defaultTimeout } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${api.baseUrl}${endpoint}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Origin: api.origin,
      },
    });
    const text = await response.text();
    const data = parseJson(text);

    if (!response.ok) {
      throw new Error(
        data?.error || data?.message || `Request failed with status ${response.status}.`
      );
    }

    return data;
  } catch (error) {
    if (error.name !== "AbortError") {
      throw error;
    }

    throw new Error(
      `Could not reach the backend at ${api.baseUrl}. Make sure npm run backend:dev is running and this device is on the same network.`
    );
  } finally {
    clearTimeout(timer);
  }
}

function postMultipart(endpoint, formData, onUploadProgress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", `${api.baseUrl}${endpoint}`);
    request.setRequestHeader("Origin", api.origin);

    request.upload.onprogress = ({ lengthComputable, loaded, total }) => {
      if (!lengthComputable || !onUploadProgress) return;
      onUploadProgress(loaded / total);
    };

    request.onload = () => {
      let data = null;

      try {
        data = request.responseText ? JSON.parse(request.responseText) : null;
      } catch {
        data = null;
      }

      if (request.status >= 200 && request.status < 300) {
        resolve(data);
        return;
      }

      reject(
        new Error(
          data?.error ||
            data?.message ||
            `Upload failed with status ${request.status}.`
        )
      );
    };

    request.onerror = () =>
      reject(
        new Error(
          `Could not reach the backend at ${api.baseUrl}. Make sure npm run backend:dev is running and this device is on the same network.`
        )
      );
    request.ontimeout = () =>
      reject(new Error(`Upload timed out after ${request.timeout / 1000}s.`));
    request.timeout = 30000;
    request.send(formData);
  });
}

function parseJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const client = {
  createFormData,
  delete: del,
  get,
  postMultipart,
};

export default client;
