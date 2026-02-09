import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

export default function Italian() {
  const { cuisineName } = useParams();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('recipes')) || [];
    const match = all.filter(r => r.cuisine?.toLowerCase() === cuisineName.toLowerCase());
    setFiltered(match);
  }, [cuisineName]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 capitalize">{cuisineName} Recipes</h2>
      {filtered.length === 0 ? (
        <p className="text-gray-500">No recipes found for this cuisine.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}