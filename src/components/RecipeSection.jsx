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
  }, [activeTab, recipes, selectedTag]);

  return (
    <section className="py-10 px-4 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedTag ? `${selectedTag} Recipes` : `${activeTab} Recipes`}
        </h2>
        {!selectedTag && (
          <div className="flex space-x-2">
            {["Trending", "New", "Fastest", "Favorites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeTab === tab
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading recipes...</p>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          {selectedTag
            ? `No recipes found for “${selectedTag}”.`
            : activeTab === "Favorites" && !currentUser
            ? "Please sign in to view your favorite recipes."
            : "No recipes found."}
        </p>
      )}
    </section>
  );
}
