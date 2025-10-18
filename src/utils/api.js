// src/utils/api.js
import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";
const RECIPE_ENDPOINT = `${BASE_URL}/recipes`;
const USER_ENDPOINT = `${BASE_URL}/users`;

// 🔹 Helper: sanitize recipe before sending to MockAPI
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

  console.log("🔍 Sanitized data:", sanitized);
  return sanitized;
};

// ✅ Recipes CRUD
export const getAllRecipes = () =>
  axios.get(RECIPE_ENDPOINT).then((res) => res.data);

export const getRecipeById = (id) =>
  axios.get(`${RECIPE_ENDPOINT}/${id}`).then((res) => res.data);

export const addRecipe = async (data) => {
  try {
    const sanitized = sanitizeRecipeData(data);

    // ✅ Convert arrays to strings for MockAPI
    const payload = {
      ...sanitized,
      ingredients: JSON.stringify(sanitized.ingredients || []),
      steps: JSON.stringify(sanitized.steps || []),
    };

    console.log("📤 Final payload to MockAPI:", payload);

    const response = await axios.post(RECIPE_ENDPOINT, payload);
    console.log("✅ MockAPI Response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ MockAPI Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

export const updateRecipe = (id, data) => {
  const sanitized = sanitizeRecipeData(data);
  return axios.put(`${RECIPE_ENDPOINT}/${id}`, {
    ...sanitized,
    ingredients: JSON.stringify(sanitized.ingredients || []),
    steps: JSON.stringify(sanitized.steps || []),
  });
};

export const deleteRecipe = (id) => axios.delete(`${RECIPE_ENDPOINT}/${id}`);

// ✅ Users
export const getAllUsers = () =>
  axios.get(USER_ENDPOINT).then((res) => res.data);

export const createUser = (data) => axios.post(USER_ENDPOINT, data);

export const getUserById = (id) =>
  axios.get(`${USER_ENDPOINT}/${id}`).then((res) => res.data);
