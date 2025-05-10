
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const found = allRecipes.find((r) => r.id === parseInt(id));
    setRecipe(found);
  }, [id]);

  if (!recipe) return <p className="p-4 text-gray-500">Recipe not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      <img src={recipe.image} alt={recipe.name} className="w-full h-64 object-cover rounded mb-6" />
      <p className="text-gray-700 mb-4">{recipe.description}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Time:</strong> {recipe.time}</p>
      {/* Add ingredients, steps, etc. */}
    </div>
  );
};

