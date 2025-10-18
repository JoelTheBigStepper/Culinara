// src/pages/AddRecipe.jsx
import React, { useState } from "react";
import { addRecipe } from "../utils/api";

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    prepTime: "",
    cookTime: "",
    difficulty: "",
    cuisine: "",
    category: "",
    ingredients: [""],
    steps: [""],
    userId: "1", // example userId
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, e, field) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("➡ Sending recipe to MockAPI:", formData);

    try {
      const response = await addRecipe(formData);
      console.log("✅ Recipe added:", response.data);
      alert("Recipe added successfully!");
      setFormData({
        title: "",
        description: "",
        image: "",
        prepTime: "",
        cookTime: "",
        difficulty: "",
        cuisine: "",
        category: "",
        ingredients: [""],
        steps: [""],
        userId: "1",
      });
    } catch (error) {
      console.error("❌ Error creating recipe:", error.response?.data || error);
      alert("Failed to create recipe. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          {formData.ingredients.map((ingredient, i) => (
            <input
              key={i}
              value={ingredient}
              onChange={(e) => handleArrayChange(i, e, "ingredients")}
              placeholder={`Ingredient ${i + 1}`}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => addField("ingredients")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Ingredient
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Steps</h3>
          {formData.steps.map((step, i) => (
            <input
              key={i}
              value={step}
              onChange={(e) => handleArrayChange(i, e, "steps")}
              placeholder={`Step ${i + 1}`}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => addField("steps")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
