import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";
const RECIPE_ENDPOINT = `${BASE_URL}/recipe`;
const USER_ENDPOINT = `${BASE_URL}/users`;

// 🔹 Clean and normalize recipe data before sending to MockAPI
const sanitizeRecipeData = (data) => {
  const sanitized = {
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
  };

  return sanitized;
};

// 🔹 Parse recipe fields coming *from* MockAPI
const parseRecipeData = (recipe) => {
  const parsed = {
    ...recipe,
    ingredients:
      typeof recipe.ingredients === "string"
        ? JSON.parse(recipe.ingredients || "[]")
        : recipe.ingredients || [],
    steps:
      typeof recipe.steps === "string"
        ? JSON.parse(recipe.steps || "[]")
        : recipe.steps || [],
  };
  return parsed;
};

// ✅ Recipes CRUD
export const getAllRecipes = async () => {
  const res = await axios.get(RECIPE_ENDPOINT);
  return res.data.map(parseRecipeData); // parse all recipes for display
};

export const getRecipeById = async (id) => {
  const res = await axios.get(`${RECIPE_ENDPOINT}/${id}`);
  return parseRecipeData(res.data);
};

export const addRecipe = async (data) => {
  const sanitized = sanitizeRecipeData(data);
  const payload = {
    ...sanitized,
    ingredients: JSON.stringify(sanitized.ingredients || []),
    steps: JSON.stringify(sanitized.steps || []),
  };

  const res = await axios.post(RECIPE_ENDPOINT, payload);
  return parseRecipeData(res.data);
};

export const updateRecipe = async (id, data) => {
  const sanitized = sanitizeRecipeData(data);
  const payload = {
    ...sanitized,
    ingredients: JSON.stringify(sanitized.ingredients || []),
    steps: JSON.stringify(sanitized.steps || []),
  };

  const res = await axios.put(`${RECIPE_ENDPOINT}/${id}`, payload);
  return parseRecipeData(res.data);
};

export const deleteRecipe = (id) => axios.delete(`${RECIPE_ENDPOINT}/${id}`);

// ✅ Users
export const getAllUsers = async () => {
  const res = await axios.get(USER_ENDPOINT);
  return res.data;
};

export const createUser = (data) => axios.post(USER_ENDPOINT, data);

export const getUserById = async (id) => {
  const res = await axios.get(`${USER_ENDPOINT}/${id}`);
  return res.data;
};
