import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeCard from "../components/RecipeCard";


export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    const filtered = allRecipes.filter((recipe) => {
      return (
        recipe.title?.toLowerCase().includes(query) ||
        recipe.cuisine?.toLowerCase().includes(query) ||
        recipe.ingredients?.some((ing) => ing.toLowerCase().includes(query))
      );
    });

    setResults(filtered);
  }, [query]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for “<span className="text-red-500">{query}</span>”
      </h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No matching recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
