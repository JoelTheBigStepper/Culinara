import { useEffect, useState } from "react";
import RecipeCard from "../../components/RecipeCard";
import { getAllRecipes } from "../../utils/api";

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [interactionData, setInteractionData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedInteractions = JSON.parse(localStorage.getItem("interactions")) || {};

    getAllRecipes()
      .then((allRecipes) => {
        const withEngagement = allRecipes.map((recipe) => {
          const { likes = 0, shares = 0 } = savedInteractions[recipe.id] || {};
          return { ...recipe, likes, shares };
        });

        const sorted = withEngagement.sort(
          (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
        );

        setRecipes(sorted);
        setInteractionData(savedInteractions);
      })
      .catch((error) => {
        console.error("Failed to fetch recipes:", error);
      })
      .finally(() => setLoading(false));
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

    const updatedRecipes = recipes.map((r) =>
      r.id === id ? { ...r, ...updated[id] } : r
    );

    const sorted = updatedRecipes.sort(
      (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
    );

    setRecipes(sorted);
  };

  return (
    <section className="max-w-7xl mx-auto p-4 mt-10">
      <h2 className="text-3xl font-bold mb-6">Trending Recipes</h2>

      {loading ? (
        <p className="text-gray-500">Loading trending recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No trending recipes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onLike={() => updateInteraction(recipe.id, "likes")}
              onShare={() => updateInteraction(recipe.id, "shares")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
