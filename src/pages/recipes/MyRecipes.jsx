import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(stored);
  }, []);

  if (recipes.length === 0) {
    return <div className="text-center mt-10 text-lg text-gray-600">No recipes added yet.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Prep Time:</strong> {recipe.prepTime}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Cook Time:</strong> {recipe.cookTime}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Difficulty:</strong> {recipe.difficulty}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Cuisine:</strong> {recipe.cuisine || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
