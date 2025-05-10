import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(), // unique ID for details page
      name,
      image,
      cuisine,
      time,
      description
    };

    const existing = JSON.parse(localStorage.getItem("recipes")) || [];
    localStorage.setItem("recipes", JSON.stringify([newRecipe, ...existing]));

    // Clear form (optional)
    setName("");
    setImage("");
    setCuisine("");
    setTime("");
    setDescription("");

    // Redirect to My Recipes
    navigate("/my-recipes");
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Cooking Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Save Recipe
        </button>
      </form>
    </div>
  );
}
