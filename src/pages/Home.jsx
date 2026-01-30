import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Flame } from "lucide-react";
import bgImage from "../assets/background.jpg";
import RecipeSection from "../components/RecipeSection";
import { getAllRecipes } from "../utils/api";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const recipes = await getAllRecipes();
        const tagSet = new Set();
        recipes.forEach((r) => {
          if (r.cuisine) tagSet.add(r.cuisine);
          if (r.category) tagSet.add(r.category);
        });
        setTags([...tagSet].sort().slice(0, 12)); // sorted alphabetically
      } catch (error) {
        console.error("Failed to load tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const prev = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const updated = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="relative px-3 sm:px-4 md:px-6 -mt-3">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 w-full max-w-4xl">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight px-2">
            Discover & Share Amazing Recipes
          </h1>
          <h2 className="text-white text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 md:mb-12 px-2 max-w-2xl mx-auto">
            Find delicious meals by searching ingredients, cuisines, or recipe names.
          </h2>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto w-full max-w-xl flex items-center bg-white rounded-lg overflow-hidden shadow-lg h-12 sm:h-14 md:h-16"
          >
            <Search className="text-gray-400 ml-3 sm:ml-4 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="flex-grow px-2 sm:px-4 h-full outline-none text-sm sm:text-base md:text-lg"
              aria-label="Search recipes"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 md:px-6 h-full transition text-sm sm:text-base font-medium flex-shrink-0"
              aria-label="Submit search"
            >
              Search
            </button>
          </form>

          {/* Scrollable Tags */}
          {!isLoadingTags && tags.length > 0 && (
            <div className="mt-5 sm:mt-6 flex overflow-x-auto gap-2 px-2 scrollbar-hide pb-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="bg-white/20 hover:bg-white/30 text-white whitespace-nowrap px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full transition flex-shrink-0 text-xs sm:text-sm md:text-base"
                  aria-label={`Search for ${tag} recipes`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Loading state for tags */}
          {isLoadingTags && (
            <div className="mt-5 sm:mt-6 flex gap-2 px-2 justify-center">
              <div className="bg-white/20 animate-pulse rounded-full px-8 py-2 h-8"></div>
              <div className="bg-white/20 animate-pulse rounded-full px-12 py-2 h-8 hidden sm:block"></div>
              <div className="bg-white/20 animate-pulse rounded-full px-10 py-2 h-8 hidden md:block"></div>
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-10 md:py-12">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Flame className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Trending This Week</h2>
        </div>
        <RecipeSection />
      </section>
    </div>
  );
}