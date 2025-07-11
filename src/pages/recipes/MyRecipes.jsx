import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, UtensilsCrossed, ChefHat } from "lucide-react";
import { getCurrentUser } from "../../utils/authUtils";
import { getAllRecipes } from "../../utils/api"; // <-- Uses MockAPI

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("User not found");
      setLoading(false);
      return;
    }

    getAllRecipes()
      .then((all) => {
        const userRecipes = all.filter((recipe) => recipe.userId === currentUser.id);
        setRecipes(userRecipes);
      })
      .catch(() => setError("Failed to load recipes"))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return <div className="text-center mt-8 text-gray-500">Loading your recipes...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (recipes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-lg text-gray-600">
        You haven’t added any recipes yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">My Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="bg-white rounded-xl transition p-2 relative shadow-sm hover:shadow-md"
          >
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
                  <p className="font-medium text-md hover:text-red-500">{recipe.cookTime || "N/A"}</p>
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
        ))}
      </div>
    </div>
  );
}
