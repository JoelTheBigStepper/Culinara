import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat, Heart, Bookmark } from "lucide-react";

export default function RecipeCard({ recipe, onLike, onShare }) {
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
        {onLike && (
          <Heart
            className="w-5 h-5 text-red-500 bg-white/80 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
            onClick={() => onLike(recipe.id)}
          />
        )}
        {onShare && (
          <Bookmark
            className="w-5 h-5 text-red-500 bg-white/80 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
            onClick={() => onShare(recipe.id)}
          />
        )}
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
              <p className="font-medium text-md">{recipe.difficulty || recipe.level || "N/A"}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
