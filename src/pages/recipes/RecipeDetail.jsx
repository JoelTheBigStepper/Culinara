import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, UtensilsCrossed, ChefHat, Users, CheckCircle } from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const updated = recipes.map((r) => {
      if (r.id === parseInt(id, 10)) {
        const updatedRecipe = {
          ...r,
          views: (r.views || 0) + 1,
        };
        setRecipe(updatedRecipe); // Update state with incremented view
        return updatedRecipe;
      }
      return r;
    });

    localStorage.setItem("recipes", JSON.stringify(updated));
  }, [id]);

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  if (!recipe) return <p className="p-4 text-gray-500">Recipe not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#f8f8f8]">
      {/* Left: Image */}
      <div>
        <img
          src={recipe.image || "/fallback.jpg"}
          alt={recipe.title}
          className="w-full h-[450px] object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Right: Info */}
      <div className="space-y-6">
        <p className="text-sm uppercase text-[#FF6F61] font-semibold">Breakfasts</p>
        <h1 className="text-4xl font-bold leading-tight">{recipe.title}</h1>

        {/* Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mt-6">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#FF6F61]" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#FF6F61]" />
            <span>{recipe.cuisine || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#FF6F61]" />
            <span>{recipe.servings || "1"} Serves</span>
          </div>
          <div className={`flex items-center gap-2 ${getDifficultyColor(recipe.difficulty)}`}>
            <ChefHat size={18} />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">Viewed {recipe.views || 1} {recipe.views === 1 ? "time" : "times"}</div>

        <p className="text-gray-700">{recipe.description}</p>

        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mt-6 mb-3">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 list-disc list-inside">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preparation Steps */}
        {recipe.steps?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mt-6 mb-3">Preparation Steps</h2>
            <div className="relative pl-6 space-y-6">
              {recipe.steps.map((step, idx) => {
                const stepText = typeof step === "string" ? step : step.instruction;
                return (
                  <div key={idx} className="flex items-start gap-6 relative pl-8">
                    <CheckCircle className="absolute -left-[22px] top-1 text-[#FF6F61] bg-white" size={18} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Step {idx + 1}:</span> {stepText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/recipes/my-recipes"
            className="inline-block bg-[#FF6F61] text-white px-6 py-3 rounded hover:bg-[#e85b50] transition"
          >
            ← Back to My Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
