import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [interactionData, setInteractionData] = useState({}); // { [id]: { likes, shares } }

  // Load recipes and interactions
  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const savedInteractions = JSON.parse(localStorage.getItem("interactions")) || {};

    const withEngagement = allRecipes.map((recipe) => {
      const { likes = 0, shares = 0 } = savedInteractions[recipe.id] || {};
      return { ...recipe, likes, shares };
    });

    const sorted = withEngagement.sort(
      (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
    );

    setRecipes(sorted);
    setInteractionData(savedInteractions);
  }, []);

  const updateInteraction = (id, type) => {
    const updated = {
      ...interactionData,
      [id]: {
        likes: interactionData[id]?.likes || 0,
        shares: interactionData[id]?.shares || 0,
        [type]: (interactionData[id]?.[type] || 0) + 1
      }
    };

    setInteractionData(updated);
    localStorage.setItem("interactions", JSON.stringify(updated));

    // Also update the display
    const newRecipes = recipes.map((r) =>
      r.id === id ? { ...r, ...updated[id] } : r
    );
    const sorted = newRecipes.sort(
      (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
    );
    setRecipes(sorted);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Trending Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-500">No trending recipes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <Link to={`/recipe/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-3 space-y-2">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-500">{recipe.cuisine}</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => updateInteraction(recipe.id, "likes")}
                    className="text-sm px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                  >
                    ❤️ {recipe.likes}
                  </button>
                  <button
                    onClick={() => updateInteraction(recipe.id, "shares")}
                    className="text-sm px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                  >
                    🔄 {recipe.shares}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
    