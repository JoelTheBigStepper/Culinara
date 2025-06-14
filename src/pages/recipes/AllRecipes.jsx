import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard";

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

  const handleFilter = (recipe) => {
    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.join(", ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine =
      filterCuisine === "All" || recipe.cuisine?.toLowerCase() === filterCuisine.toLowerCase();

    const matchesDifficulty =
      filterDifficulty === "All" ||
      (recipe.difficulty && recipe.difficulty.toLowerCase() === filterDifficulty.toLowerCase());

    return matchesSearch && matchesCuisine && matchesDifficulty;
  };

  const sortedFilteredRecipes = () => {
    let filtered = recipes.filter(handleFilter);

    switch (sortOrder) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "cookTimeAsc":
        filtered.sort((a, b) => parseInt(a.cookTime) - parseInt(b.cookTime));
        break;
      case "cookTimeDesc":
        filtered.sort((a, b) => parseInt(b.cookTime) - parseInt(a.cookTime));
        break;
      default:
        break;
    }

    return filtered;
  };

  const uniqueCuisines = ["All", ...new Set(recipes.map((r) => r.cuisine).filter(Boolean))];
  const difficulties = ["All", "Easy", "Moderate", "Hard"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">All Recipes</h2>

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search by title, ingredient, or cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-full sm:w-60"
        />

        <select
          value={filterCuisine}
          onChange={(e) => setFilterCuisine(e.target.value)}
          className="border px-3 py-2 rounded-md w-full sm:w-40"
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
          className="border px-3 py-2 rounded-md w-full sm:w-48"
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
          className="border px-3 py-2 rounded-md w-full sm:w-56"
        >
          <option value="latest">Newest First</option>
          <option value="cookTimeAsc">Cook Time: Low to High</option>
          <option value="cookTimeDesc">Cook Time: High to Low</option>
        </select>
      </div>

      {/* Recipe Grid */}
      {sortedFilteredRecipes().length === 0 ? (
        <p className="text-gray-500 text-center">No recipes match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFilteredRecipes().map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
