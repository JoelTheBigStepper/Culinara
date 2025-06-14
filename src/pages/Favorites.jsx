import React, { useEffect, useState } from "react";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recipes");
    if (stored) {
      setRecipes(JSON.parse(stored));
    }
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
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">My Recipes</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600 text-center">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <div
              key={i}
              className="bg-white shadow-sm hover:shadow-md transition rounded-xl overflow-hidden flex flex-col"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{recipe.title}</h3>

                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Prep:</span> {recipe.prepTime} &nbsp;|&nbsp;
                  <span className="font-medium">Cook:</span> {recipe.cookTime}
                </p>

                <p className={`text-sm mb-4 font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  Difficulty: {recipe.difficulty || "N/A"}
                </p>

                <div className="mb-3">
                  <h4 className="font-bold text-sm mb-1">Ingredients:</h4>
                  {recipe.ingredients?.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {recipe.ingredients.map((ing, j) => (
                        <li key={j}>{ing}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No ingredients listed.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-1">Steps:</h4>
                  {recipe.steps?.length > 0 ? (
                    <ol className="list-decimal pl-5 text-sm space-y-1">
                      {recipe.steps.map((step, j) => (
                        <li key={j}>{typeof step === "string" ? step : step?.instruction}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-400 text-sm">No steps provided.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
