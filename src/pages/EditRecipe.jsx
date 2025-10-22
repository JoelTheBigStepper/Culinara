import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../utils/api";
import { uploadImageToCloudinary } from "../utils/cloudinary";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [uploading, setUploading] = useState(false);

 const currentUser = JSON.parse(localStorage.getItem("currentUser"));


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeById(id);

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser || String(res.userId) !== String(currentUser.id)) {
          setUnauthorized(true);
        } else {
          setRecipe(res);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
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
      setError("Failed to update recipe.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (unauthorized)
    return <div className="text-center text-red-500 mt-8">Unauthorized Access</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          name="title"
          value={recipe.title || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Recipe Title"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={recipe.description || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
          placeholder="Short description"
          required
        />

        {/* Cuisine */}
        <input
          name="cuisine"
          value={recipe.cuisine || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Cuisine (e.g., Italian, Nigerian)"
        />

        {/* Category */}
        <input
          name="category"
          value={recipe.category || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Category (e.g., Dessert, Breakfast)"
        />

        {/* Ingredients */}
        <textarea
          name="ingredients"
          value={recipe.ingredients || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
          placeholder="Ingredients (comma-separated)"
        />

        {/* Steps */}
        <textarea
          name="steps"
          value={recipe.steps || ""}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
          placeholder="Steps (separate by line)"
        />

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Recipe Image</label>
          {recipe.image && (
            <img
              src={recipe.image}
              alt="Recipe"
              className="w-full h-48 object-cover rounded mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
        >
          {uploading ? "Saving..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
}
