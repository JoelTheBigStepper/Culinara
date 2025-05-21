// src/pages/recipes/AllRecipes.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed, ChefHat } from "lucide-react";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(stored);
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

  const handleFilter = (recipe) => {
    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.join(", ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine = filterCuisine === "All" || recipe.cuisine === filterCuisine;
    const matchesDifficulty = filterDifficulty === "All" || recipe.difficulty === filterDifficulty;

    return matchesSearch && matchesCuisine && matchesDifficulty;
  };

  const sortedFilteredRecipes = () => {
    let filtered = recipes.filter(handleFilter);

    if (sortOrder === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const uniqueCuisines = ["All", ...new Set(recipes.map((r) => r.cuisine).filter(Boolean))];
  const difficulties = ["All", "Easy", "Moderate", "Hard"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">All Recipes</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by title, ingredient, or cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-full sm:w-72"
        />

        <select
          value={filterCuisine}
          onChange={(e) => setFilterCuisine(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          {uniqueCuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          {difficulties.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="latest">Newest First</option>
        </select>
      </div>

      {/* Recipe Grid */}
      {sortedFilteredRecipes().length === 0 ? (
        <p className="text-gray-500">No recipes match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFilteredRecipes().map((recipe) => (
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
                    <p className="font-medium text-md hover:text-red-500">{recipe.cookTime}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <UtensilsCrossed size={16} className="text-gray-400" />
                    <p className="font-medium text-md hover:text-red-500">{recipe.cuisine || "N/A"}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${getDifficultyColor(recipe.difficulty)}`}>
                    <ChefHat size={20} />
                    <p className="font-medium text-md">{recipe.difficulty}</p>
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
