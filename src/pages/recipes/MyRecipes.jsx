import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(storedRecipes);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Recipes</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img src={recipe.image} alt={recipe.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{recipe.name}</h2>
                <p className="text-sm text-gray-500">
                  {recipe.cuisine} • {recipe.time}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
