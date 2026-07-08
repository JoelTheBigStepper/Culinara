import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { getAllRecipes } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getFavoriteIds } from "../utils/api";

export default function RecipeSection({ selectedTag = "" }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [activeTab, setActiveTab] = useState("Trending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecipes()
      .then(setRecipes)
      .catch((err) => console.error("Failed to fetch recipes:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    getFavoriteIds()
      .then(setFavoriteIds)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!recipes.length) return;

    let filtered = [];

    if (selectedTag) {
      filtered = recipes.filter(
        (r) =>
          r.cuisine?.toLowerCase() === selectedTag.toLowerCase() ||
          r.category?.toLowerCase() === selectedTag.toLowerCase()
      );
    } else {
      switch (activeTab) {
        case "Trending":
          filtered = [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6);
          break;
        case "New":
          filtered = [...recipes].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "Fastest":
          filtered = [...recipes].sort(
            (a, b) => parseInt(a.cookTime) - parseInt(b.cookTime)
          );
          break;
        case "Favorites":
          if (user && favoriteIds.length) {
            filtered = recipes.filter((r) =>
              favoriteIds.map((id) => id.toString()).includes((r._id || r.id).toString())
            );
          }
          break;
        default:
          filtered = recipes;
      }
    }

    setFilteredRecipes(filtered);
  }, [activeTab, recipes, selectedTag, user, favoriteIds]);

  return (
    <section className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {selectedTag ? `${selectedTag} Recipes` : `${activeTab} Recipes`}
        </h2>

        {!selectedTag && (
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["Trending", "New", "Fastest", "Favorites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 sm:h-72 md:h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id || recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <p className="text-gray-500 text-sm sm:text-base md:text-lg px-4">
            {selectedTag
              ? `No recipes found for "${selectedTag}".`
              : activeTab === "Favorites" && !user
              ? "Please sign in to view your favorite recipes."
              : "No recipes found."}
          </p>
          {activeTab === "Favorites" && !user && (
            <button
              onClick={() => (window.location.href = "/signin")}
              className="mt-4 px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </section>
  );
}