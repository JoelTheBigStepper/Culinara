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
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <p className="text-gray-700 mb-4">{recipe.description}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
      <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
