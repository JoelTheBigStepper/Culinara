// src/utils/api.js
import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/recipe"; // ✅ correct base

export const getAllRecipes = () => axios.get(BASE_URL).then(res => res.data);
export const getRecipeById = (id) => axios.get(`${BASE_URL}/${id}`).then(res => res.data);
export const addRecipe = (data) => axios.post(BASE_URL, data);
export const updateRecipe = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteRecipe = (id) => axios.delete(`${BASE_URL}/${id}`);
