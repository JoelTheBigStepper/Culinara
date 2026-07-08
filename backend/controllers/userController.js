import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// ─── GET user profile ─────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshTokens");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ─── PUT update own profile ───────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      user.password = password; // pre-save hook will hash it
    }

    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ─── GET user favorites (returns full recipe objects) ─────────
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// ─── GET favorite IDs only (for RecipeCard checks) ───────────
export const getFavoriteIds = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites); // array of ObjectId strings
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorite IDs" });
  }
};

// ─── POST toggle favorite ─────────────────────────────────────
export const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: "recipeId is required" });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const user = await User.findById(req.user._id);
    const alreadyFavorited = user.favorites.some(
      (id) => id.toString() === recipeId
    );

    if (alreadyFavorited) {
      user.favorites = user.favorites.filter((id) => id.toString() !== recipeId);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json(user.favorites); // return updated favorites array
  } catch (err) {
    console.error("Toggle favorite error:", err.message);
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
};