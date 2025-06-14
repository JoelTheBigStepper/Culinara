// src/pages/SearchResults.jsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeCard from "../components/RecipeCard";

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('query')?.toLowerCase().trim() || '';
    setQuery(searchQuery);

    if (!searchQuery) {
      setResults([]);
      return;
    }

    const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    const filtered = allRecipes.filter((recipe) => {
      return (
        recipe.title?.toLowerCase().includes(searchQuery) ||
        recipe.cuisine?.toLowerCase().includes(searchQuery) ||
        recipe.category?.toLowerCase().includes(searchQuery) ||
        recipe.difficulty?.toLowerCase().includes(searchQuery) ||
        recipe.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery))
      );
    });

    setResults(filtered);
  }, [location.search]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Search Results for{" "}
        <span className="text-red-500">“{query || '...'}”</span>
      </h2>

      {!query ? (
        <p className="text-gray-500">Please enter a search term.</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No matching recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
