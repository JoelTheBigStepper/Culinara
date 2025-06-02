import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [interactionData, setInteractionData] = useState({});

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
        [type]: (interactionData[id]?.[type] || 0) + 1,
      },
    };

    setInteractionData(updated);
    localStorage.setItem("interactions", JSON.stringify(updated));

    const newRecipes = recipes.map((r) =>
      r.id === id ? { ...r, ...updated[id] } : r
    );

    const sorted = newRecipes.sort(
      (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
    );

    setRecipes(sorted);
  };

  return (
    <section className="max-w-7xl mx-auto p-4 mt-10">
      <h2 className="text-3xl font-bold mb-6">Trending Recipes</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-500">No trending recipes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 relative"
            >
              {/* Rating badge */}
              <div className="absolute top-2 left-2 bg-yellow-400 text-white text-sm px-2 py-0.5 rounded font-bold shadow">
                ★ {recipe.rating}
              </div>

              {/* Like & Share buttons */}
              <div className="absolute top-2 right-2 space-y-1 flex flex-col items-end">
                <Heart
                  className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
                  onClick={() => updateInteraction(recipe.id, "likes")}
                />
                <Bookmark
                  className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
                  onClick={() => updateInteraction(recipe.id, "shares")}
                />
              </div>

              {/* Image */}
              <Link to={`/recipe/${recipe.id}`}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded"
                />
              </Link>

              {/* Info Section */}
              <div className="mt-3 px-1">
                <div className="text-xs text-red-600 font-semibold">
                  {recipe.category}
                </div>
                <h3 className="font-semibold text-sm mt-1 line-clamp-2">
                  {recipe.title}
                </h3>
                <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
                  <span>⏱ {recipe.time}</span>
                  <span>🌍 {recipe.cuisine}</span>
                  <span>📘 {recipe.level}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400 flex gap-3">
                  <span>❤️ {recipe.likes}</span>
                  <span>🔄 {recipe.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
