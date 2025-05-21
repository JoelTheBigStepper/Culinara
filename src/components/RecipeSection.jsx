import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Clock, UtensilsCrossed, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Latest Recipes', 'Most Popular Recipes', 'Fastest Recipes', "Editor's Choice"];

export default function RecipeSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [recipes, setRecipes] = useState([]);
  const [interactionData, setInteractionData] = useState({});

  const loadRecipesFromStorage = () => {
    const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const savedInteractions = JSON.parse(localStorage.getItem('interactions')) || {};

    const withEngagement = allRecipes.map((recipe) => {
      const { likes = 0, shares = 0 } = savedInteractions[recipe.id] || {};
      return { ...recipe, likes, shares };
    });

    setRecipes(withEngagement);
    setInteractionData(savedInteractions);
  };

  useEffect(() => {
    loadRecipesFromStorage();
  }, [activeTab]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'recipes' || e.key === 'interactions') {
        loadRecipesFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateInteraction = (id, type) => {
    const updated = {
      ...interactionData,
      [id]: {
        likes: interactionData[id]?.likes || 0,
        shares: interactionData[id]?.shares || 0,
        [type]: (interactionData[id]?.[type] || 0) + 1,
      },
    };

    setInteractionData(updated);
    localStorage.setItem('interactions', JSON.stringify(updated));

    const newRecipes = recipes.map((r) => (r.id === id ? { ...r, ...updated[r.id] } : r));
    setRecipes(newRecipes);
  };

  const filteredRecipes = () => {
    if (activeTab === 'Most Popular Recipes') {
      return [...recipes].sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares));
    } else if (activeTab === 'Fastest Recipes') {
      return [...recipes].sort((a, b) => {
        const timeA = parseInt(a.prepTime || '0') + parseInt(a.cookTime || '0');
        const timeB = parseInt(b.prepTime || '0') + parseInt(b.cookTime || '0');
        return timeA - timeB;
      });
    } else if (activeTab === "Editor's Choice") {
      return recipes.slice(0, 5); // placeholder logic
    } else {
      return [...recipes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const getDifficultyColor = (level) => {
    if (!level) return 'text-gray-400';
    switch (level.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4 mt-10">
      <div className="flex items-center space-x-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={loadRecipesFromStorage}
          className="ml-auto text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh Recipes
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filteredRecipes().length === 0 ? (
            <p className="text-gray-500">No recipes available.</p>
          ) : (
            filteredRecipes().map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl transition p-2 relative shadow-sm hover:shadow-md"
              >
                <div className="absolute top-2 left-2 bg-yellow-400 text-white text-sm px-2 py-0.5 rounded font-bold shadow">
                  ★ {recipe.rating}
                </div>
                <div className="absolute top-2 right-2 space-y-1 flex flex-col items-end z-10">
                  <Heart
                    className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
                    onClick={() => updateInteraction(recipe.id, 'likes')}
                  />
                  <Bookmark
                    className="w-5 h-5 text-red-500 bg-white/70 rounded-full p-1 cursor-pointer hover:text-white hover:bg-red-500"
                    onClick={() => updateInteraction(recipe.id, 'shares')}
                  />
                </div>
                <Link to={`/recipe/${recipe.id}`}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="rounded-lg w-full h-72 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-2xl hover:text-red-500 mt-1 mb-4 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-gray-400" />
                        <p className="font-medium text-md hover:text-red-500">{recipe.cookTime}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <UtensilsCrossed size={16} className="text-gray-400" />
                        <p className="font-medium text-md hover:text-red-500">
                          {recipe.cuisine || 'N/A'}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${getDifficultyColor(
                          recipe.difficulty
                        )}`}
                      >
                        <ChefHat size={20} />
                        <p className="font-medium text-md">{recipe.difficulty}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
