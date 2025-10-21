import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Bookmark, Clock, UtensilsCrossed, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";
const tabs = ["Latest Recipes", "Most Popular", "Fastest", "Editor's Pick"];

export default function RecipeSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [recipes, setRecipes] = useState([]);
  const [engagement, setEngagement] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      // Fetch all recipes from MockAPI
      const { data } = await axios.get(`${BASE_URL}/recipes`);
      const inter = JSON.parse(localStorage.getItem("interactions")) || {};
      const user = JSON.parse(localStorage.getItem("user"));

      const merged = data.map((r) => ({
        ...r,
        likes: inter[r.id]?.likes || 0,
        shares: inter[r.id]?.shares || 0,
        isFavorite: user?.favorites?.includes(r.id) || false,
      }));

      setRecipes(merged);
      setEngagement(inter);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // fallback to localStorage
      const all = JSON.parse(localStorage.getItem("recipes")) || [];
      setRecipes(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab]);

  const handleEngage = (id, type) => {
    const updated = {
      ...engagement,
      [id]: {
        likes: engagement[id]?.likes || 0,
        shares: engagement[id]?.shares || 0,
        [type]: (engagement[id]?.[type] || 0) + 1,
      },
    };
    setEngagement(updated);
    localStorage.setItem("interactions", JSON.stringify(updated));
    setRecipes((recipes) =>
      recipes.map((r) => (r.id === id ? { ...r, ...updated[id] } : r))
    );
  };

  const handleBookmark = async (recipeId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      const isFavorite = user.favorites?.includes(recipeId);
      const updatedFavorites = isFavorite
        ? user.favorites.filter((id) => id !== recipeId)
        : [...(user.favorites || []), recipeId];

      await axios.put(`${BASE_URL}/users/${user.id}`, {
        ...user,
        favorites: updatedFavorites,
      });

      const updatedUser = { ...user, favorites: updatedFavorites };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, isFavorite: !isFavorite } : r
        )
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const sorter = () => {
    switch (activeTab) {
      case tabs[1]:
        return [...recipes].sort(
          (a, b) => b.likes + b.shares - (a.likes + a.shares)
        );
      case tabs[2]:
        return [...recipes].sort(
          (a, b) =>
            parseInt(a.prepTime || 0) + parseInt(a.cookTime || 0) -
            (parseInt(b.prepTime || 0) + parseInt(b.cookTime || 0))
        );
      case tabs[3]:
        return recipes.slice(0, 5);
      default:
        return [...recipes].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  const difficultyColor = (level) => {
    if (!level) return "text-gray-400";
    switch (level.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Loading recipes...</div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap gap-4 border-b pb-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-lg font-medium pb-2 ${
              activeTab === tab
                ? "border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {sorter().map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow group hover:shadow-lg transition"
            >
              <div className="relative">
                <Link to={`/recipe/${recipe.id}`}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-0.5 rounded-md">
                  ★ {recipe.rating || "—"}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Heart
                    onClick={() => handleEngage(recipe.id, "likes")}
                    className="w-5 h-5 text-red-500 bg-white/70 p-1 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
                  />
                  <Bookmark
                    onClick={() => handleBookmark(recipe.id)}
                    className={`w-5 h-5 p-1 rounded-full cursor-pointer transition 
                      ${
                        recipe.isFavorite
                          ? "bg-red-500 text-white"
                          : "bg-white/70 text-red-500"
                      } hover:bg-red-500 hover:text-white`}
                    title={
                      recipe.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600">
                  {recipe.title}
                </h3>
                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {recipe.cookTime || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed size={16} /> {recipe.cuisine || "—"}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${difficultyColor(
                      recipe.difficulty
                    )}`}
                  >
                    <ChefHat size={16} /> {recipe.difficulty || "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {sorter().length === 0 && (
            <p className="text-gray-500">No recipes to display.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
