import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getRemainingTime(createdAt) {
  const expirationTime = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  const remaining = expirationTime - now;
  return remaining > 0 ? remaining : 0;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function NewRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const updateRecipes = () => {
      const all = JSON.parse(localStorage.getItem("recipes")) || [];
      const filtered = all
        .filter((recipe) => getRemainingTime(recipe.createdAt) > 0)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRecipes(filtered);
    };

    updateRecipes(); // run once on mount
    const interval = setInterval(updateRecipes, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">New Recipes (Last 24 Hours)</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-500">No new recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => {
            const timeLeft = getRemainingTime(recipe.createdAt);
            return (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">{recipe.cookTime}</p>
                  <p className="text-xs text-red-500 mt-1">
                    Expires in: {formatTime(timeLeft)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
