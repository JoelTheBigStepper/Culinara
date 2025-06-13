// src/pages/CategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, UtensilsCrossed, ChefHat } from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const filtered = allRecipes.filter(
      (r) => r.category?.toLowerCase() === category.toLowerCase()
    );
    setFilteredRecipes(filtered);
  }, [category]);

  const formatCategory = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).replace("-", " ");

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">
        {formatCategory(category)} Recipes
      </h2>

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-56 sm:h-64 md:h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 hover:text-red-500 transition">
                  {recipe.title}
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-400" />
                    <p className="font-medium hover:text-red-500 transition">{recipe.cookTime}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <UtensilsCrossed size={16} className="text-gray-400" />
                    <p className="font-medium hover:text-red-500 transition">{recipe.cuisine || "N/A"}</p>
                  </div>
                  <div className={`flex items-center gap-1 col-span-2 ${getDifficultyColor(recipe.difficulty)}`}>
                    <ChefHat size={18} />
                    <p className="font-medium">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
