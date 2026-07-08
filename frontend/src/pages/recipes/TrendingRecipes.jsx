import { useEffect, useState } from "react";
import RecipeCard from "../../components/RecipeCard";
import { getAllRecipes } from "../../utils/api";

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecipes()
      .then((all) => {
        const sorted = [...all].sort(
          (a, b) => (b.likes || 0) - (a.likes || 0)
        );
        setRecipes(sorted);
      })
      .catch((err) => console.error("Failed to fetch recipes:", err))
      .finally(() => setLoading(false));
  }, []);

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
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}