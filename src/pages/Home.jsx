import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Flame } from "lucide-react";
import bgImage from "../assets/background.jpg";
import RecipeSection from "../components/RecipeSection";
import { getAllRecipes } from "../utils/api";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await getAllRecipes(); // ✅ Now fetches from MockAPI

        const tagSet = new Set();
        recipes.forEach((r) => {
          if (r.cuisine) tagSet.add(r.cuisine);
          if (r.category) tagSet.add(r.category);
        });

        setTags(Array.from(tagSet).slice(0, 8)); // Limit to 8 tags
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchRecipes();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Save recent searches in localStorage for user convenience
    const prev = JSON.parse(localStorage.getItem("recentSearches")) || [];
    localStorage.setItem(
      "recentSearches",
      JSON.stringify([query, ...prev.filter((q) => q !== query)].slice(0, 10))
    );

    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative p-4 -mt-3">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-2">
            Discover & Share Amazing Recipes
          </h1>
          <h2 className="text-white text-lg md:text-xl font-light mb-12">
            Find delicious meals by searching ingredients, cuisines, or recipe names.
          </h2>

          {/* Search Bar */}
          <form
            onSubmit={onSearch}
            className="mx-auto mt-4 max-w-xl flex items-center bg-white rounded-lg overflow-hidden shadow-lg h-16"
          >
            <Search className="text-gray-400 ml-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="flex-grow px-4 h-full outline-none text-lg"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 h-full"
            >
              Search
            </button>
          </form>

          {/* Dynamic Tags */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 justify-center">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/search?query=${encodeURIComponent(tag)}`)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-red-500" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </div>

        <RecipeSection />
      </section>
    </div>
  );
}
