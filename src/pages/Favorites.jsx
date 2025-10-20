import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/authUtils";
import { getUserFavorites, getAllRecipes, toggleFavorite } from "../utils/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }

      try {
        const userFavorites = await getUserFavorites(currentUser.id);
        const allRecipes = await getAllRecipes();
        const favorites = allRecipes.filter((recipe) =>
          userFavorites.includes(recipe.id)
        );
        setFavoriteRecipes(favorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // ✅ Remove from favorites immediately after unbookmarking
  const handleToggleFavorite = async (recipeId) => {
    try {
      const updated = await toggleFavorite(currentUser.id, recipeId);
      const updatedFavorites = favoriteRecipes.filter((r) =>
        updated.includes(r.id)
      );
      setFavoriteRecipes(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-600">
          Please log in to view your favorite recipes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>
    );
  }

  if (favoriteRecipes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">
          You haven't added any recipes to your favorites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Favorites ❤️</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onToggleFavorite={() => handleToggleFavorite(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}
