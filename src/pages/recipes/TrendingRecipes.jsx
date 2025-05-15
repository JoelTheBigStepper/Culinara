// src/pages/TrendingRecipes.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const sorted = allRecipes
      .filter(r => r.views) // Only recipes with views
      .sort((a, b) => b.views - a.views); // Sort descending
    setRecipes(sorted);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">🔥 Trending Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-500">No trending recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500">
                  {recipe.cookTime} · {recipe.views || 0} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
