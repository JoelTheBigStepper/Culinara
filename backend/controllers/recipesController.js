import Recipe from "../models/Recipe.js";

// ─── GET all recipes ──────────────────────────────────────────
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// ─── GET single recipe ────────────────────────────────────────
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// ─── POST create recipe ───────────────────────────────────────
export const createRecipe = async (req, res) => {
  try {
    const {
      title, description, image, ingredients, steps,
      prepTime, cookTime, difficulty, cuisine, category,
    } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const recipe = await Recipe.create({
      title,
      description,
      image,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      steps: Array.isArray(steps) ? steps : [],
      prepTime,
      cookTime,
      difficulty,
      cuisine,
      category,
      userId: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("Create recipe error:", err.message);
    res.status(500).json({ message: "Failed to create recipe" });
  }
};

// ─── PUT update recipe ────────────────────────────────────────
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Only owner can update
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    const allowed = [
      "title", "description", "image", "ingredients", "steps",
      "prepTime", "cookTime", "difficulty", "cuisine", "category",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) recipe[field] = req.body[field];
    });

    const updated = await recipe.save();
    res.json(updated);
  } catch (err) {
    console.error("Update recipe error:", err.message);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

// ─── DELETE recipe ────────────────────────────────────────────
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Only owner can delete
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

// ─── GET recipes by user ──────────────────────────────────────
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your recipes" });
  }
};