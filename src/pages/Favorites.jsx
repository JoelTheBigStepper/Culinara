import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/authUtils";
import { getAllRecipes } from "../utils/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  // const [favorites, setFavorites] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    let mounted = true;
    async function loadRecipes() {
      try {
        const data = await getAllRecipes();
        if (mounted && Array.isArray(data)) {
          setRecipes(data);
        }
      } catch (err) {
        console.error("Failed to load recipes:", err);
      }
    }
    loadRecipes();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLike = (recipeId) => {
    // placeholder: update UI optimistically or call API
    console.log("like", recipeId);
  };

  const handleBookmark = (recipeId) => {
    // placeholder: update UI optimistically or call API
    console.log("bookmark", recipeId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Favorites ❤️</h2>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            currentUser={currentUser} // ✅ Pass this
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No favorite recipes yet.</p>
      )}
    </div>
  );
}
