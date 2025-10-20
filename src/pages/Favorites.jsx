import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/authUtils";
import { getAllRecipes } from "../utils/api";
// import { getFavorites } from "../utils/favorites";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  // const [favorites, setFavorites] = useState([]);
  const currentUser = getCurrentUser();

  // useEffect(() => {
  //   if (!currentUser) return;
  //   const favIds = getFavorites(currentUser.id);
  //   setFavorites(favIds);

  //   // fetch all recipes and filter only favorites
  //   getAllRecipes().then((all) => {
  //     const favRecipes = all.filter((r) => favIds.includes(r.id));
  //     setRecipes(favRecipes);
  //   });
  // }, [currentUser]);

  // if (!currentUser) {
  //   return (
  //     <div className="max-w-2xl mx-auto text-center py-16">
  //       <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
  //       <p>You need to be signed in to view your favorite recipes.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Favorites ❤️</h2>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No favorite recipes yet.</p>
      )}
    </div>
  );
}
