import React, { useEffect, useState } from "react";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recipes");
    if (stored) {
      setRecipes(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-1">{recipe.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Difficulty: {recipe.difficulty}
              </p>
              <h4 className="font-bold">Ingredients:</h4>
              <ul className="list-disc pl-5 text-sm mb-2">
                {recipe.ingredients.map((ing, j) => (
                  <li key={j}>{ing}</li>
                ))}
              </ul>
              <h4 className="font-bold">Steps:</h4>
              <ol className="list-decimal pl-5 text-sm">
                {recipe.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

