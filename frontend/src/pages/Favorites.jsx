import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFavorites, toggleFavorite } from "../utils/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { user } = useAuth();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getFavorites()
      .then(setFavoriteRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const updatedIds = await toggleFavorite(recipeId);
      setFavoriteRecipes((prev) =>
        prev.filter((r) => updatedIds.map((id) => id.toString()).includes((r._id || r.id).toString()))
      );
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-600">Please log in to view your favorite recipes.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>;
  }

  if (favoriteRecipes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">You haven't added any recipes to your favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Favorites ❤️</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id || recipe.id}
            recipe={recipe}
            onToggleFavorite={() => handleToggleFavorite(recipe._id || recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}