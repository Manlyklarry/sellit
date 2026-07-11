import { saveCurrentUser } from "../auth/session";
import api from "../config/api";
import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

function getFileName(uri) {
  return uri.split("/").pop() || "profile.jpg";
}

function getMimeType(uri) {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}

export async function getUser(id) {
  const data = await client.get(API_ENDPOINTS.users.byId(id));

  return normalizeUser(data?.user);
}

export async function updateProfile({
  imageUri,
  name,
  removeImage = false,
  user,
  username,
}) {
  const formData = client.createFormData({
    name,
    removeImage,
    user,
    username,
  });

  if (imageUri) {
    formData.append("image", {
      uri: imageUri,
      name: getFileName(imageUri),
      type: getMimeType(imageUri),
    });
  }

  const data = await client.putMultipart(API_ENDPOINTS.users.profile, formData);
  const updatedUser = normalizeUser(data?.user);

  if (updatedUser) {
    await saveCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function normalizeUser(user) {
  if (!user) return null;

  const image = normalizeImageUrl(user.image);

  return {
    email: user.email || null,
    id: user.id || null,
    image,
    imageSource: image ? { uri: image } : null,
    name: user.name || null,
    username: user.username || null,
  };
}

function normalizeImageUrl(image) {
  if (!image) return null;

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${api.baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}
