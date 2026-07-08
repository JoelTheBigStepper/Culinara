import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRecipeById, updateRecipe } from "../../utils/api";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        const ownerId = data.userId?._id || data.userId;
        if (!user || String(ownerId) !== String(user._id)) {
          setUnauthorized(true);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };

    if (user !== undefined) fetchRecipe(); // wait for auth to resolve
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...(recipe[field] || [])];
    updated[index] = value;
    setRecipe((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setRecipe((prev) => ({ ...prev, [field]: [...(prev[field] || []), ""] }));
  };

  const removeArrayItem = (field, index) => {
    setRecipe((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setRecipe((prev) => ({ ...prev, image: url }));
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRecipe(id, recipe);
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message || "Failed to update recipe.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (unauthorized) return <div className="text-center text-red-500 mt-8">Unauthorized Access</div>;
  if (error && !recipe) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={recipe.title || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={recipe.description || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            rows={3}
            required
          />
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium mb-1">Cuisine</label>
          <select
            name="cuisine"
            value={recipe.cuisine || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            {["Nigerian","Brazilian","Italian","Japanese","Korean","Chinese",
              "German","Mexican","Greek","Indian","Spanish","Thai","American",
              "French","Turkish","Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={recipe.category || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            {["Dessert","Breakfast","Lunch","Dinner","Snack","Beverage",
              "Appetizer","Side Dish","Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={recipe.difficulty || "beginner"}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Prep & Cook Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prep Time</label>
            <input
              name="prepTime"
              value={recipe.prepTime || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="e.g. 15 mins"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cook Time</label>
            <input
              name="cookTime"
              value={recipe.cookTime || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="e.g. 30 mins"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          {(recipe.ingredients || []).map((ing, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ing}
                onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              {recipe.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("ingredients", index)}
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("ingredients")}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-2">Steps</label>
          {(recipe.steps || []).map((step, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <textarea
                value={step}
                onChange={(e) => handleArrayChange("steps", index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                rows={2}
              />
              {recipe.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("steps", index)}
                  className="text-red-400 hover:text-red-600 px-2 self-start mt-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("steps")}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Step
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Recipe Image</label>
          {recipe.image && (
            <img
              src={recipe.image}
              alt="Recipe"
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {uploading ? "Uploading image..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
}