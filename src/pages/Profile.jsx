import React, { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/authUtils";
import { useNavigate, Link } from "react-router-dom";
import { getAllRecipes } from "../utils/api";
import {
  User,
  Mail,
  BookOpen,
  LogOut,
  Edit3,
  Calendar,
  ArrowRight,
  Menu,
  X,
  FileText,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myRecipeCount, setMyRecipeCount] = useState(0);
  const [myRecentRecipes, setMyRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) return navigate("/signin");
    setUser(current);

    const fetchUserRecipes = async () => {
      try {
        const recipes = await getAllRecipes();
        const userRecipes = recipes
          .filter((r) => r.userId === current.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMyRecipeCount(userRecipes.length);
        setMyRecentRecipes(userRecipes.slice(0, 4)); // show 4 most recent
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
    <div className="max-w-6xl mx-auto px-6 py-10 mt-8">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 relative overflow-hidden">
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

          {/* Stats */}
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
                  View All Recipes →
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="absolute top-6 right-6 sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Buttons */}
          <div
            className={`${
              menuOpen ? "flex" : "hidden sm:flex"
            } flex-col sm:flex-row gap-4 mt-8 w-full sm:justify-center transition-all`}
          >
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

      {/* Recent Recipes */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          My Recent Recipes
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading recipes...</p>
        ) : myRecentRecipes.length === 0 ? (
          <p className="text-gray-500">
            You haven’t added any recipes yet.{" "}
            <Link to="/add-recipe" className="text-red-500 underline">
              Create your first one!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myRecentRecipes.map((recipe) => (
              <Link
                to={`/recipe/${recipe.id}`}
                key={recipe.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 relative"
              >
                {/* Edit Button (on hover) */}
                <Link
                  to={`/edit-recipe/${recipe.id}`}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-md opacity-0 hover:opacity-100 transition"
                  title="Edit Recipe"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <div className="h-40 w-full overflow-hidden rounded-t-xl">
                  <img
                    src={
                      recipe.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">
                    {recipe.title}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                  <div className="flex items-center text-red-500 text-sm mt-2 font-medium">
                    View Recipe <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Blog Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          My Blog Posts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-xs text-gray-400">Oct {20 + i}, 2025</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                How to Cook Like a Pro #{i}
              </h4>
              <p className="text-gray-500 text-sm line-clamp-3">
                Discover essential kitchen skills, tricks, and time-saving tips
                to improve your cooking game and elevate your recipes.
              </p>
              <Link
                to="#"
                className="text-red-500 text-sm font-medium mt-3 inline-flex items-center"
              >
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
