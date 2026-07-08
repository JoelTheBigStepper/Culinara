import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

// Stream a buffer to Cloudinary instead of writing to disk
const streamToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" }, // serve webp/avif where supported
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

// POST /api/upload/image?folder=recipes  (or /avatars)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const folder = `culinara/${req.query.folder || "general"}`;
    const result = await streamToCloudinary(req.file.buffer, folder);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    res.status(500).json({ message: "Image upload failed" });
  }
};

// DELETE /api/upload/image  { publicId }
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId is required" });

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
    res.status(500).json({ message: "Image delete failed" });
  }
};