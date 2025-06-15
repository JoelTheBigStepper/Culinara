import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Flame, Utensils, Clock } from "lucide-react";
import bgImage from "../assets/background.jpg";

const trendingTags = ["Pasta", "Vegan", "Quick Meals", "Chicken", "Desserts", "Nigerian", "Healthy"];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored.slice(0, 5)); // show last 5 searches
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const prev = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const updated = [query, ...prev.filter((q) => q !== query)];
    localStorage.setItem("recentSearches", JSON.stringify(updated.slice(0, 10)));

    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center px-4 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-6">
          Explore trending dishes, healthy meals, and quick bites. Start your cooking adventure now.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-lg overflow-hidden shadow-md max-w-xl mx-auto"
        >
          <Search className="text-gray-500 ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
          >
            Search
          </button>
        </form>

        {/* Trending Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm sm:text-base">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="bg-white/10 border border-white/20 hover:bg-white/20 transition text-white px-4 py-2 rounded-full"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
