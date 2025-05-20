import {  useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import { Heart, Bookmark } from 'lucide-react';


const tabs = ['Latest Recipes', 'Most Popular Recipes', 'Fastest Recipes', "Editor's Choice"];


export default function RecipeSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [recipes, setRecipes] = useState([]);
    const [interactionData, setInteractionData] = useState({}); // { [id]: { likes, shares } }
  
    // Load recipes and interactions
    useEffect(() => {
      const allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  
      const savedInteractions = JSON.parse(localStorage.getItem("interactions")) || {};
  
      const withEngagement = allRecipes.map((recipe) => {
        const { likes = 0, shares = 0 } = savedInteractions[recipe.id] || {};
        return { ...recipe, likes, shares };
      });
  
      const sorted = withEngagement.sort(
        (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
      );
  
      setRecipes(sorted);
      setInteractionData(savedInteractions);
    }, []);
  
    const updateInteraction = (id, type) => {
      const updated = {
        ...interactionData,
        [id]: {
          likes: interactionData[id]?.likes || 0,
          shares: interactionData[id]?.shares || 0,
          [type]: (interactionData[id]?.[type] || 0) + 1
        }
      };
  
      setInteractionData(updated);
      localStorage.setItem("interactions", JSON.stringify(updated));
  
      // Also update the display
      const newRecipes = recipes.map((r) =>
        r.id === id ? { ...r, ...updated[id] } : r
      );
      const sorted = newRecipes.sort(
        (a, b) => (b.likes + b.shares) - (a.likes + a.shares)
      );
      setRecipes(sorted);
    };
  
  return (
    <section className="max-w-7xl mx-auto p-4 mt-10">
      <div className="flex items-center space-x-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab
                ? 'border-b-2 border-black text-black'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {recipes.length === 0 ? (
        <p className="text-gray-500">No trending recipes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 relative"
          >
            <div className="absolute top-2 left-2 bg-yellow-400 text-white text-sm px-2 py-0.5 rounded font-bold shadow">
              ★ {recipe.rating}
            </div>
           <Link to={`/recipe/${recipe.id}`}>
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            </Link>
            <div className="absolute top-2 right-2 space-y-1 flex flex-col items-end">
              <Heart className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500" />
              <Bookmark className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500" />
            </div>
            <div className="text-xs text-red-600 font-semibold mt-3">
              {recipe.category}
            </div>
            <h3 className="font-semibold text-sm mt-1 line-clamp-2">
              {recipe.title}
            </h3>
            <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
              <span>⏱ {recipe.time}</span>
              <span>🌍 {recipe.cuisine}</span>
              <span>📘 {recipe.level}</span>
            </div>
          </div>
        ))}
        </div>
      )}
      </div>
    </section>
  );
}
