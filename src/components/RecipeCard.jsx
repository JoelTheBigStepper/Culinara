import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat, Heart, Bookmark } from "lucide-react";
import { useState } from "react";
import { addFavoriteRecipe } from "../utils/api"; // we'll use this later

export default function RecipeCard({ recipe, currentUser, onLike, onBookmark }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = async () => {
    if (!currentUser) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      setIsBookmarked(true);
      await onBookmark(recipe.id);
    } catch (err) {
      console.error("Error adding favorite:", err);
      alert("Failed to add to favorites");
    }
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
      <div className="absolute top-2 right-2 space-y-2 flex flex-col items-end">
        <div
          className={`flex items-center gap-1 bg-white/80 rounded-full px-2 py-1 cursor-pointer transition hover:bg-red-500 hover:text-white ${
            isBookmarked ? "bg-red-500 text-white" : "text-red-500"
          }`}
          onClick={handleBookmarkClick}
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
              <p className="font-medium text-md hover:text-red-500">
                {recipe.cookTime || recipe.time || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <UtensilsCrossed size={16} className="text-gray-400" />
              <p className="font-medium text-md hover:text-red-500">
                {recipe.cuisine || "N/A"}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 ${getDifficultyColor(
                recipe.difficulty || recipe.level
              )}`}
            >
              <ChefHat size={20} />
              <p className="font-medium text-md">
                {recipe.difficulty || recipe.level || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
