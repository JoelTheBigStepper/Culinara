import React, { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/authUtils";
import { useNavigate, Link } from "react-router-dom";
import { getAllRecipes } from "../utils/api";
import { User, Mail, BookOpen, LogOut, Edit3, Calendar } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myRecipeCount, setMyRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) return navigate("/signin");
    setUser(current);

    const fetchUserRecipes = async () => {
      try {
        const recipes = await getAllRecipes();
        const userRecipes = recipes.filter((r) => r.userId === current.id);
        setMyRecipeCount(userRecipes.length);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 mt-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 relative overflow-hidden">
        {/* Decorative gradient ring */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-100 rounded-full blur-3xl opacity-40" />
        <div className="relative flex flex-col items-center text-center z-10">
          {/* Avatar */}
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={`${user.name || "User"} avatar`}
            className="w-28 h-28 rounded-full object-cover border-4 border-red-500 shadow-lg"
          />

          {/* User Info */}
          <h2 className="text-3xl font-bold mt-5">{user.name}</h2>
          <p className="text-gray-500 flex items-center justify-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user.email}
          </p>

          <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mt-1">
            <Calendar className="w-4 h-4" /> Joined {joinedDate}
          </p>

          {/* Recipe stats */}
          <div className="mt-8 w-full sm:w-3/4 bg-gray-50 rounded-xl py-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading your recipes...</p>
            ) : (
              <div>
                <p className="text-gray-700 text-lg flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">{myRecipeCount}</span>{" "}
                  Recipe{myRecipeCount !== 1 ? "s" : ""} Created
                </p>
                <Link
                  to="/my-recipes"
                  className="text-red-500 font-medium hover:underline mt-1 inline-block"
                >
                  View My Recipes →
                </Link>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:justify-center">
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 hover:bg-red-50 py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
