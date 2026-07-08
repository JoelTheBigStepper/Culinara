import express from "express";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// POST /api/upload/image?folder=recipes|avatars
router.post("/image", protect, upload.single("image"), uploadImage);

// DELETE /api/upload/image  — send { publicId } in body
router.delete("/image", protect, deleteImage);

export default router;