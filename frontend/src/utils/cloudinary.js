// src/utils/cloudinary.js
// All uploads now go through the backend — no Cloudinary credentials on the client.

import { apiFetch } from "./api";

/**
 * Upload an image file via the backend.
 * @param {File} file - The image file to upload
 * @param {"recipes"|"avatars"} folder - Cloudinary folder to store in
 * @returns {Promise<string>} The secure Cloudinary URL
 */
export const uploadImageToCloudinary = async (file, folder = "recipes") => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch(`/upload/image?folder=${folder}`, {
    method: "POST",
    body: formData,
    headers: {}, // let browser set Content-Type with boundary for multipart
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Image upload failed");
  }

  const data = await res.json();
  return data.url;
};