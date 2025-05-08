
import React, { useState } from "react";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Recipe Added!");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Recipe Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 w-full" placeholder="Enter recipe title" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Ingredients</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 w-full" rows="5" placeholder="Enter ingredients (separate with commas)"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Steps</label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-4 w-full" rows="5" placeholder="Enter steps (separate with commas)"></textarea>
        </div>
        <div className="mb-4">
          <button type="submit" className="bg-coral-600 text-white py-2 px-4 rounded-lg">Submit Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
