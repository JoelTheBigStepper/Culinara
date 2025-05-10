import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, UtensilsCrossed, ChefHat } from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const found = allRecipes.find((r) => r.id === parseInt(id));
    setRecipe(found);
  }, [id]);

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (!recipe) return <p className="p-4 text-gray-500">Recipe not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-64 object-cover rounded mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#FF6F61]" />
          <span>{recipe.cookTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-[#FF6F61]" />
          <span>{recipe.cuisine || "N/A"}</span>
        </div>
        <div className={`flex items-center gap-2 ${getDifficultyColor(recipe.difficulty)}`}>
          <ChefHat size={18} />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      <div className="text-gray-700">
        {/* Add ingredients and steps here if needed */}
        <p className="mb-4"><strong>Description:</strong> {recipe.description || 'No description provided.'}</p>
        {/* ... */}
      </div>
    </div>
  );
}
