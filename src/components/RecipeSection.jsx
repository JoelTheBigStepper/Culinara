import axios from "axios";

const BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";

// ...
const handleBookmark = async (recipeId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please log in to add favorites");
    return;
  }

  try {
    const isFavorite = user.favorites?.includes(recipeId);
    const updatedFavorites = isFavorite
      ? user.favorites.filter((id) => id !== recipeId)
      : [...(user.favorites || []), recipeId];

    // Update on MockAPI
    await axios.put(`${BASE_URL}/users/${user.id}`, {
      ...user,
      favorites: updatedFavorites,
    });

    // Update localStorage
    const updatedUser = { ...user, favorites: updatedFavorites };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update recipes in state to reflect instantly
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId ? { ...r, isFavorite: !isFavorite } : r
      )
    );
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};
