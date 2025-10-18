// src/utils/cloudinary.js
import axios from "axios";

// Replace with your Cloudinary details
const CLOUD_NAME = "dbjsaynct";
const UPLOAD_PRESET = "recipe_upload"; // Unsigned preset name from Cloudinary

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.secure_url; // ✅ Cloudinary hosted image URL
  } catch (err) {
    console.error("Cloudinary upload error:", err.response?.data || err.message);
    throw new Error("Image upload failed. Please try again.");
  }
};
