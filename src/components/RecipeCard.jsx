import { Link } from "react-router-dom";
import {
  Clock,
  UtensilsCrossed,
  ChefHat,
  Heart,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toggleFavorite, getUserById } from "../utils/api";

export default function RecipeCard({ recipe, onLike, onShare, currentUserId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Check if recipe is already in favorites when component mounts
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!currentUserId) return;
      try {
        const user = await getUserById(currentUserId);
        setIsFavorite(user.favorites?.includes(recipe.id));
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };
    fetchFavoriteStatus();
  }, [recipe.id, currentUserId]);

  // ✅ Toggle favorite status
  const handleBookmark = async (e) => {
    e.preventDefault(); // prevent link navigation
    if (!currentUserId) {
      alert("Please log in to save favorites");
      return;
    }

    try {
      const updatedFavorites = await toggleFavorite(currentUserId, recipe.id);
      setIsFavorite(updatedFavorites.includes(recipe.id));
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  // ✅ Difficulty color helper
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
      {/* Top-right actions */}
      <div className="absolute top-2 right-2 space-y-2 flex flex-col items-end">
        {onLike && (
          <Heart
            className="w-5 h-5 text-red-500 bg-white/80 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
            onClick={() => onLike(recipe.id)}
          />
        )}

        {/* ✅ Bookmark (Favorite) Button */}
        <button
          onClick={handleBookmark}
          className={`group w-10 h-10 bg-white rounded-full p-1 m-2 flex items-center justify-center transition-all duration-200 
            ${isFavorite ? "ring-1 ring-red-400" : ""}
            hover:bg-red-500 hover:scale-105`}
        >
          {isFavorite ? (
            <BookmarkCheck
              size={28}
              className="text-red-500 transition-all duration-200 group-hover:text-white"
            />
          ) : (
            <Bookmark
              size={28}
              className="text-red-500 transition-all duration-200 group-hover:text-white"
            />
          )}
        </button>
      </div>

      {/* Recipe content */}
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
