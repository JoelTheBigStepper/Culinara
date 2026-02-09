import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, UtensilsCrossed, ChefHat } from "lucide-react";
import { getAllRecipes } from "../utils/api"; // ✅ Add this line

export default function CuisinePage() {
  const { cuisine } = useParams();
  const navigate = useNavigate();

  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await getAllRecipes(); // ✅ Fetch from API
        const filtered = recipes.filter(
          (r) => r.cuisine?.toLowerCase() === cuisine.toLowerCase()
        );
        setAllRecipes(filtered);
        setFilteredRecipes(filtered);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [cuisine]);

  useEffect(() => {
    let results = [...allRecipes];

    if (searchTerm.trim()) {
      results = results.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "cookTime") {
      results.sort((a, b) => parseInt(a.cookTime) - parseInt(b.cookTime));
    } else if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "difficulty") {
      const order = { easy: 1, moderate: 2, hard: 3 };
      results.sort((a, b) => order[a.difficulty?.toLowerCase()] - order[b.difficulty?.toLowerCase()]);
    }

    setFilteredRecipes(results);
  }, [searchTerm, sortBy, allRecipes]);

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

  const formatCuisine = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).replace("-", " ");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">{formatCuisine(cuisine)} Recipes</h2>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-500 hover:underline mt-1"
          >
            ← Back to All Cuisines
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-60"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-48"
          >
            <option value="">Sort by</option>
            <option value="title">Title (A-Z)</option>
            <option value="cookTime">Cook Time</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found for this cuisine.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
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
                    <p className="font-medium text-md hover:text-red-500">
                      {recipe.cookTime}
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
                      recipe.difficulty
                    )}`}
                  >
                    <ChefHat size={20} />
                    <p className="font-medium text-md">
                      {recipe.difficulty || "N/A"}
                    </p>
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
