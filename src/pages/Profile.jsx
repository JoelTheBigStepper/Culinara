import React, { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/authUtils";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myRecipeCount, setMyRecipeCount] = useState(0);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) return navigate("/signin");
    setUser(current);

    const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const userRecipes = allRecipes.filter(r => r.userId === current.id);
    setMyRecipeCount(userRecipes.length);
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 mt-8 bg-white shadow-md rounded-xl">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt={`${user.name || "User"} avatar`}
          className="w-24 h-24 rounded-full object-cover border-2 border-red-500 shadow-sm"
        />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>

        {/* Recipe count and link */}
        <div className="mt-6 w-full text-center">
          <p className="text-md text-gray-700">
            <span className="font-semibold">{myRecipeCount}</span> Recipe{myRecipeCount !== 1 ? "s" : ""} Created
          </p>
          <Link
            to="/my-recipes"
            className="text-red-500 font-medium hover:underline mt-1 inline-block"
          >
            View My Recipes
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:justify-center">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-500 hover:bg-red-50 py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
