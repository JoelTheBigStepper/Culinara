import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat, Heart, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite, getFavoriteIds } from "../utils/api";

export default function RecipeCard({ recipe, onLike }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  useEffect(() => {
    if (!user) return;
    getFavoriteIds()
      .then(setFavoriteIds)
      .catch(() => {});
  }, [user]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add favorites.");
      return;
    }
    try {
      const updated = await toggleFavorite(recipe._id || recipe.id);
      setFavoriteIds(updated.map((id) => id.toString()));
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const recipeId = (recipe._id || recipe.id)?.toString();
  const isFavorite = favoriteIds.map((id) => id.toString()).includes(recipeId);

  const getDifficultyColor = (level) => {
    if (!level) return "text-gray-400";
    switch (level.toLowerCase()) {
      case "beginner": return "text-green-600";
      case "intermediate": return "text-yellow-600";
      case "advanced": return "text-red-600";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl transition p-2 relative shadow-sm hover:shadow-md">
      {/* Top-right icons */}
      <div className="absolute top-4 right-4 space-y-2 flex flex-col items-end">
        {onLike && (
          <div
            onClick={() => onLike(recipeId)}
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
            className={`cursor-pointer rounded-full p-2 transition-all duration-200 ${
              isHeartHovered ? "bg-red-500 text-white" : "bg-white text-red-500"
            }`}
          >
            <Heart
              size={26}
              className={`transition-transform duration-200 ${isHeartHovered ? "scale-110" : "scale-100"}`}
              fill={isHeartHovered ? "currentColor" : "none"}
            />
          </div>
        )}

        <div
          onClick={handleFavoriteClick}
          onMouseEnter={() => setIsBookmarkHovered(true)}
          onMouseLeave={() => setIsBookmarkHovered(false)}
          className={`cursor-pointer rounded-full p-2 transition-all duration-200 ${
            isBookmarkHovered || isFavorite ? "bg-red-500 text-white" : "bg-white text-red-500"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Bookmark
            size={26}
            className={`transition-transform duration-200 ${isBookmarkHovered ? "scale-110" : "scale-100"}`}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </div>
      </div>

      <Link to={`/recipe/${recipe._id || recipe.id}`}>
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
                {recipe.cookTime || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <UtensilsCrossed size={16} className="text-gray-400" />
              <p className="font-medium text-md hover:text-red-500">
                {recipe.cuisine || "N/A"}
              </p>
            </div>
            <div className={`flex items-center gap-1 ${getDifficultyColor(recipe.difficulty)}`}>
              <ChefHat size={20} />
              <p className="font-medium text-md">{recipe.difficulty || "N/A"}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}