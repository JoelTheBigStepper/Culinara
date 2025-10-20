import { useEffect, useState } from "react";
import { getFavorites } from "../utils/api";
import RecipeCard from "../components/RecipeCard";

const Favorites = ({ currentUserId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await getFavorites(currentUserId);
        setFavorites(favs);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [currentUserId]);

  if (loading) return <p className="text-center mt-10">Loading favorites...</p>;

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Favorites ❤️</h2>
      {favorites.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
