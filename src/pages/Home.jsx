import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import RecipeSection from "../components/RecipeSection";
import myImage from "../assets/chef-logo.png";
import bgImage from "../assets/background.jpg";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div>
      <div
        className="h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="flex flex-col items-start gap-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-2xl">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <img
                src={myImage}
                alt="Culinara logo"
                className="h-16 w-16 object-contain"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] leading-snug">
                Bringing Flavor to Your Fingertips
              </h1>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex w-full rounded-lg shadow-md overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes, ingredients, cuisines..."
                  className="flex-grow px-4 py-3 text-base outline-none bg-white"
                />
                <button
                  type="submit"
                  className="bg-[#FF6F61] text-white w-14 flex items-center justify-center hover:bg-[#e05c4f] transition"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recipe Sections */}
      <RecipeSection />
    </div>
  );
};

export default Home;
