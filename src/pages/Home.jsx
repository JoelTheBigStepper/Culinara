import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRecipes } from "../utils/api";
import RecipeSection from "../components/RecipeSection";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch recipes from MockAPI
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);

        // ✅ Collect unique cuisines + categories for tags
        const uniqueTags = Array.from(
          new Set([
            ...data.map((r) => r.cuisine).filter(Boolean),
            ...data.map((r) => r.category).filter(Boolean),
          ])
        );
        setTags(uniqueTags);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // ✅ Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchTerm("");
    }
  };

  // ✅ Handle tag click
  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* 🌟 Hero Section with Search Bar */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Delicious Recipes 🍲
        </h1>
        <p className="text-gray-600 mb-6">
          Search for your favorite dishes, cuisines, or categories.
        </p>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center items-center gap-3"
        >
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
          />
          <button
            type="submit"
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* 🏷️ Dynamic Tags */}
      {tags.length > 0 && (
        <section className="flex flex-wrap justify-center gap-3 mb-10">
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-500 font-medium px-4 py-2 rounded-full transition"
            >
              {tag}
            </button>
          ))}
        </section>
      )}

      {/* 🍽️ Recipe Sections */}
      <RecipeSection title="Latest Recipes" recipes={recipes} />
    </main>
  );
}
