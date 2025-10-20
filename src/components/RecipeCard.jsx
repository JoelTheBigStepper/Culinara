import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat, Heart, Bookmark } from "lucide-react";
import { toggleFavorite, getUserFavorites } from "../utils/api";

export default function RecipeCard({ recipe, currentUser }) {
  const [favorites, setFavorites] = useState([]);
  const isFavorite = favorites.includes(recipe.id);

  // ✅ Load user's favorites once
  useEffect(() => {
    if (currentUser?.id) {
      getUserFavorites(currentUser.id).then(setFavorites);
    }
  }, [currentUser]);

  const handleBookmark = async (e) => {
    e.preventDefault(); // prevent Link navigation
    if (!currentUser) return alert("Please log in to add favorites");

    const updated = await toggleFavorite(currentUser.id, recipe.id);
    setFavorites(updated);
  };

  const getDifficultyColor = (level) => {
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

  return (
    <div className="bg-white rounded-xl transition p-2 relative shadow-sm hover:shadow-md">
      <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
        <div
          className={`w-7 h-7 rounded-full p-1 cursor-pointer transition ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-red-500"
          } hover:bg-red-500 hover:text-white`}
          onClick={handleBookmark}
        >
          <Bookmark className="w-5 h-5" />
        </div>
      </div>

      <Link to={`/recipe/${recipe.id}`}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="rounded-lg w-full h-72 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-2xl hover:text-red-500 mt-1 mb-4 line-clamp-2">
            {recipe.title}
          </h3>
          <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" />
              <p>{recipe.cookTime || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1">
              <UtensilsCrossed size={16} className="text-gray-400" />
              <p>{recipe.cuisine || "N/A"}</p>
            </div>
            <div
              className={`flex items-center gap-1 ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              <ChefHat size={20} />
              <p>{recipe.difficulty || "N/A"}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
