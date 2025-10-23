import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat, Heart, Bookmark } from "lucide-react";
import { getCurrentUser } from "../utils/authUtils";
import { toggleFavorite, getUserFavorites } from "../utils/api";

export default function RecipeCard({ recipe, onLike, onShare }) {
  const [favorites, setFavorites] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const currentUser = getCurrentUser();

  // ✅ Load user's favorites once on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (currentUser) {
        try {
          const favs = await getUserFavorites(currentUser.id);
          setFavorites(favs);
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      }
    };
    fetchFavorites();
  }, [currentUser]);

  // ✅ Handle add/remove favorite
  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!currentUser) {
      alert("Please log in to add favorites.");
      return;
    }

    try {
      const updated = await toggleFavorite(currentUser.id, recipe.id);
      setFavorites(updated);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // ✅ Check if current recipe is in favorites
  const isFavorite = favorites.includes(recipe.id);

  // ✅ Difficulty color
  const getDifficultyColor = (level) => {
    if (!level) return "text-gray-400";
    switch (level.toLowerCase()) {
      case "beginner":
        return "text-green-600";
      case "intermediate":
        return "text-yellow-600";
      case "advanced":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className="bg-white rounded-xl transition p-2 relative shadow-sm hover:shadow-md"
     
    >
      {/* 🔹 Top-right icons */}
      <div className="absolute top-4 right-4 space-y-2 flex flex-col items-end"
         onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}      
      >
        {/* Like button (if any external like handler passed) */}
        {onLike && (
          <Heart size={25}
            className="text-red-500 bg-white rounded-full p-1 m-2 cursor-pointer hover:text-white hover:bg-red-500"
            onClick={() => onLike(recipe.id)}
          />
        )}

        {/* 🔹 Favorite (Bookmark) button */}
        <div
          onClick={handleFavoriteClick}
          className={`cursor-pointer rounded-full p-1 transition-all duration-10 ${
            isHovered || isFavorite
              ? "bg-red-500 text-white"
              : "bg-white text-red-500"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Bookmark
            size={25}
            className={`transition-transform duration-10 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </div>
      </div>

      {/* 🔹 Recipe body */}
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
