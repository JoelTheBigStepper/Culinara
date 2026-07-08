import express from "express";
import {
  getUserById,
  updateProfile,
  getFavorites,
  getFavoriteIds,
  toggleFavorite,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getUserById);                      // public profile lookup
router.put("/profile", protect, updateProfile);       // update own profile
router.get("/favorites/all", protect, getFavorites);  // full recipe objects
router.get("/favorites/ids", protect, getFavoriteIds);// IDs only
router.post("/favorites/toggle", protect, toggleFavorite);

export default router;