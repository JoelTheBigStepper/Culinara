// src/components/RecipeSection.jsx
import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import axios from "axios";

const API_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1/recipe";

export default function RecipeSection({ selectedTag = "" }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("Trending");
  const [loading, setLoading] = useState(true);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(API_URL);
        console.log("✅ Recipes fetched:", res.data);
        setRecipes(res.data);
      } catch (err) {
        console.error("❌ Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (!recipes.length) return;

    let filtered = [];

    if (selectedTag) {
      // For Home page tags
      filtered = recipes.filter(
        (r) =>
          r.cuisine?.toLowerCase() === selectedTag.toLowerCase() ||
          r.category?.toLowerCase() === selectedTag.toLowerCase()
      );
    } else {
      switch (activeTab) {
        case "Trending":
          filtered = [...recipes].sort((a, b) => b.likes - a.likes).slice(0, 6);
          break;
        case "New":
          filtered = [...recipes].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "Fastest":
          filtered = [...recipes].sort((a, b) => a.cookTime - b.cookTime);
          break;
        case "Favorites":
          if (currentUser) {
            const favoriteIds =
              JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`)) ||
              [];
            filtered = recipes.filter((r) => favoriteIds.includes(r.id));
          }
          break;
        default:
          filtered = recipes;
      }
    }

    console.log("🧮 Filtered Recipes:", filtered);
    setFilteredRecipes(filtered);
  }, [activeTab, recipes, selectedTag, currentUser]);

  return (
    <section className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {selectedTag ? `${selectedTag} Recipes` : `${activeTab} Recipes`}
        </h2>
        
        {/* Tab Navigation */}
        {!selectedTag && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            {["Trending", "New", "Fastest", "Favorites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                aria-label={`View ${tab.toLowerCase()} recipes`}
                aria-pressed={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-64 sm:h-72 md:h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredRecipes.length > 0 ? (
        /* Recipe Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 md:py-20">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg px-4">
            {selectedTag
              ? `No recipes found for "${selectedTag}".`
              : activeTab === "Favorites" && !currentUser
              ? "Please sign in to view your favorite recipes."
              : "No recipes found."}
          </p>
          {activeTab === "Favorites" && !currentUser && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </section>
  );
}