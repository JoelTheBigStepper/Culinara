import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";
const RECIPE_ENDPOINT = `${BASE_URL}/recipe`;
const USER_ENDPOINT = `${BASE_URL}/users`;

/* --------------------------------------------- */
/* 🔹 Normalize Recipe Data Before Sending */
/* --------------------------------------------- */
const sanitizeRecipeData = (data) => ({
  title: String(data.title || ""),
  description: String(data.description || ""),
  image: String(data.image || ""),
  createdAt: data.createdAt || new Date().toISOString(),
  prepTime: String(data.prepTime || "0"),
  cookTime: String(data.cookTime || "0"),
  difficulty: String(data.difficulty || "easy"),
  cuisine: String(data.cuisine || "Other"),
  category: String(data.category || "Other"),
  userId: String(data.userId || ""),
  ingredients: Array.isArray(data.ingredients)
    ? data.ingredients.filter((i) => i && String(i).trim() !== "")
    : [],
  steps: Array.isArray(data.steps)
    ? data.steps.filter((s) => s && String(s).trim() !== "")
    : [],
});

/* --------------------------------------------- */
/* 🔹 Parse Recipe Data Coming From MockAPI */
/* --------------------------------------------- */
const parseRecipeData = (recipe) => ({
  ...recipe,
  ingredients:
    typeof recipe.ingredients === "string"
      ? JSON.parse(recipe.ingredients || "[]")
      : recipe.ingredients || [],
  steps:
    typeof recipe.steps === "string"
      ? JSON.parse(recipe.steps || "[]")
      : recipe.steps || [],
});

/* --------------------------------------------- */
/* ✅ RECIPES CRUD */
/* --------------------------------------------- */
export const getAllRecipes = async () => {
  const res = await fetch(`${BASE_URL}/recipe`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
};

export const getRecipeById = async (id) => {
  const res = await axios.get(`${RECIPE_ENDPOINT}/${id}`);
  return parseRecipeData(res.data);
};

export const addRecipe = async (data) => {
  const sanitized = sanitizeRecipeData(data);
  const payload = {
    ...sanitized,
    ingredients: JSON.stringify(sanitized.ingredients),
    steps: JSON.stringify(sanitized.steps),
  };

  const res = await axios.post(RECIPE_ENDPOINT, payload);
  return parseRecipeData(res.data);
};

export const updateRecipe = async (id, data) => {
  const sanitized = sanitizeRecipeData(data);
  const payload = {
    ...sanitized,
    ingredients: JSON.stringify(sanitized.ingredients),
    steps: JSON.stringify(sanitized.steps),
  };

  const res = await axios.put(`${RECIPE_ENDPOINT}/${id}`, payload);
  return parseRecipeData(res.data);
};

export const deleteRecipe = async (id) => {
  await axios.delete(`${RECIPE_ENDPOINT}/${id}`);
  return true;
};

/* --------------------------------------------- */
/* ✅ USERS CRUD */
/* --------------------------------------------- */
export const getAllUsers = async () => {
  const res = await axios.get(USER_ENDPOINT);
  return res.data;
};

export const createUser = async (data) => {
  const res = await axios.post(USER_ENDPOINT, data);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`${USER_ENDPOINT}/${id}`);
  return res.data;
};

/* --------------------------------------------- */
/* ✅ FAVORITES (stored in user object) */
/* --------------------------------------------- */
export const getUserFavorites = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  const user = await res.json();
  return user.favorites || [];
};
export const toggleFavorite = async (userId, recipeId) => {
  // Fetch user
  const res = await axios.get(`${USER_ENDPOINT}/${userId}`);
  const user = res.data;

  const favorites = user.favorites || [];
  const updatedFavorites = favorites.includes(recipeId)
    ? favorites.filter((id) => id !== recipeId)
    : [...favorites, recipeId];

  // Update user favorites
  const updatedUser = { ...user, favorites: updatedFavorites };
  await axios.put(`${USER_ENDPOINT}/${userId}`, updatedUser);

   await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...user, favorites: updatedFavorites }),
  });
  
  return updatedFavorites;
};
