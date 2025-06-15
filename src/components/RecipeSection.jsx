import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Clock, UtensilsCrossed, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Latest Recipes', 'Most Popular', 'Fastest', "Editor's Pick"];

export default function RecipeSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [recipes, setRecipes] = useState([]);
  const [engagement, setEngagement] = useState({});

  const load = () => {
    const all = JSON.parse(localStorage.getItem('recipes')) || [];
    const inter = JSON.parse(localStorage.getItem('interactions')) || {};
    const merged = all.map(r => ({
      ...r,
      likes: inter[r.id]?.likes || 0,
      shares: inter[r.id]?.shares || 0,
    }));
    setRecipes(merged);
    setEngagement(inter);
  };

  useEffect(load, [activeTab]);

  useEffect(() => {
    const handler = e => {
      if (['recipes','interactions'].includes(e.key)) load();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleEngage = (id, type) => {
    const updated = {
      ...engagement,
      [id]: {
        likes: engagement[id]?.likes || 0,
        shares: engagement[id]?.shares || 0,
        [type]: (engagement[id]?.[type] || 0) + 1
      }
    };
    setEngagement(updated);
    localStorage.setItem('interactions', JSON.stringify(updated));
    setRecipes(recipes.map(r => r.id === id ? {...r, ...updated[id]} : r));
  };

  const sorter = () => {
    switch (activeTab) {
      case tabs[1]:
        return [...recipes].sort((a,b) => (b.likes + b.shares) - (a.likes + a.shares));
      case tabs[2]:
        return [...recipes].sort((a,b) =>
          (parseInt(a.prepTime)+parseInt(a.cookTime)) -
          (parseInt(b.prepTime)+parseInt(b.cookTime))
        );
      case tabs[3]:
        return recipes.slice(0, 5);
      default:
        return [...recipes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const difficultyColor = level => {
    if (!level) return 'text-gray-400';
    switch(level.toLowerCase()){
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap gap-4 border-b pb-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-lg font-medium pb-2 ${
              activeTab === tab ? 'border-b-2 border-black' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{opacity:0, y:20}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0, y:-20}}
          transition={{duration:0.3}}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {sorter().map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow group hover:shadow-lg transition">
              <div className="relative">
                <Link to={`/recipe/${recipe.id}`}>
                  <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-t-xl"/>
                </Link>
                <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-0.5 rounded-md">★ {recipe.rating}</div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Heart
                    onClick={() => handleEngage(recipe.id,'likes')}
                    className="w-5 h-5 text-red-500 bg-white/70 p-1 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
                  />
                  <Bookmark
                    onClick={() => handleEngage(recipe.id,'shares')}
                    className="w-5 h-5 text-red-500 bg-white/70 p-1 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600">{recipe.title}</h3>
                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                  <span className="flex items-center gap-1"><Clock size={16}/> {recipe.cookTime}</span>
                  <span className="flex items-center gap-1"><UtensilsCrossed size={16}/> {recipe.cuisine}</span>
                  <span className={`flex items-center gap-1 ${difficultyColor(recipe.difficulty)}`}>
                    <ChefHat size={16}/> {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {sorter().length === 0 && <p className="text-gray-500">No recipes to display.</p>}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
