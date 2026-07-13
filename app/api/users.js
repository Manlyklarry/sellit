import { saveCurrentUser } from "../auth/session";
import api from "../config/api";
import { UPLOAD_DEFAULTS } from "../config/constants";
import { toAbsoluteUrl } from "../utils/urls";
import { getUploadFile } from "../utils/uploads";
import client from "./client";
import { API_ENDPOINTS } from "./endpoints";

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
    formData.append(
      "image",
      getUploadFile(imageUri, UPLOAD_DEFAULTS.profileFileName)
    );
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

  const image = toAbsoluteUrl(user.image, api.baseUrl);

  return {
    email: user.email || null,
    id: user.id || null,
    image,
    imageSource: image ? { uri: image } : null,
    name: user.name || null,
    username: user.username || null,
  };
}
