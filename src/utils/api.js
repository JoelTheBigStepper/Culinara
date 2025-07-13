// src/utils/api.js
import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";
const RECIPE_ENDPOINT = `${BASE_URL}/recipes`;
const USER_ENDPOINT = `${BASE_URL}/users`; // Optional if you’ll manage users here too

// ✅ Recipes
export const getAllRecipes = () => axios.get(RECIPE_ENDPOINT).then(res => res.data);
export const getRecipeById = (id) => axios.get(`${RECIPE_ENDPOINT}/${id}`).then(res => res.data);
export const addRecipe = (data) => axios.post(RECIPE_ENDPOINT, data);
export const updateRecipe = (id, data) => axios.put(`${RECIPE_ENDPOINT}/${id}`, data);
export const deleteRecipe = (id) => axios.delete(`${RECIPE_ENDPOINT}/${id}`);

// ✅ Users (optional - if you want to centralize user API functions)
export const getAllUsers = () => axios.get(USER_ENDPOINT).then(res => res.data);
export const createUser = (data) => axios.post(USER_ENDPOINT, data);
export const getUserById = (id) => axios.get(`${USER_ENDPOINT}/${id}`).then(res => res.data);
