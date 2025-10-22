import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getAllRecipes } from "../utils/api"; // ✅ Fetch recipes from MockAPI

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchQuery =
      new URLSearchParams(location.search).get("query")?.toLowerCase().trim() || "";
    setQuery(searchQuery);

    const fetchAndFilter = async () => {
      if (!searchQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allRecipes = await getAllRecipes();

        const filtered = allRecipes.filter((recipe) => {
          const ingredientsArray = Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : recipe.ingredients
            ? recipe.ingredients.split(",")
            : [];

          return (
            recipe.title?.toLowerCase().includes(searchQuery) ||
            recipe.cuisine?.toLowerCase().includes(searchQuery) ||
            recipe.category?.toLowerCase().includes(searchQuery) ||
            recipe.difficulty?.toLowerCase().includes(searchQuery) ||
            ingredientsArray.some((ing) =>
              ing.toLowerCase().includes(searchQuery)
            )
          );
        });

        setResults(filtered);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [location.search]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Search Results for{" "}
        <span className="text-red-500">“{query || "..."}”</span>
      </h2>

      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : !query ? (
        <p className="text-gray-500">Please enter a search term.</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No matching recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
