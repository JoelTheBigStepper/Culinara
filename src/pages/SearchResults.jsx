import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
    <section className="max-w-7xl mx-auto p-4 mt-10">
      <h2 className="text-xl font-semibold mb-6">Search Results for “{query}”</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No matching recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((recipe) => (
            <div key={recipe.id} className="bg-white p-4 shadow rounded-lg">
              <Link to={`/recipe/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded" />
                <h3 className="font-semibold mt-2">{recipe.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Cuisine: {recipe.cuisine}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
