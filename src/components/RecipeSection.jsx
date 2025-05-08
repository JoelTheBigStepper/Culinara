import { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import pastaImg from '../assets/pasta.jpg';
import quinoaImg from '../assets/quinoa.jpg';
import beefImg from '../assets/beef.jpg';
import pancakesImg from '../assets/pancakes.jpg';
import cakeImg from '../assets/cake.jpg';


const tabs = ['Latest Recipes', 'Most Popular Recipes', 'Fastest Recipes', "Editor's Choice"];

const recipes = [
  {
    id: 1,
    title: 'Creamy Garlic Mushroom Penne Pasta',
    category: 'Pasta',
    image: pastaImg,
    rating: 4.8,
    time: '5 min',
    cuisine: 'Lebanese',
    level: 'Beginner',
  },
  {
    id: 2,
    title: 'Zesty Lemon Quinoa with Fresh Herbs',
    category: 'Salads',
    image: quinoaImg,
    rating: 4.5,
    time: '60 min',
    cuisine: 'Moroccan',
    level: 'Beginner',
  },
  {
    id: 3,
    title: 'Smoky Barbecue Pulled Beef Sandwiches',
    category: 'Meat',
    image: beefImg,
    rating: 4.8,
    time: '15 min',
    cuisine: 'French',
    level: 'Easy',
  },
  {
    id: 4,
    title: 'Fluffy Banana Pancakes with Maple Syrup',
    category: 'Breakfasts',
    image: pancakesImg,
    rating: 4.8,
    time: '60 min',
    cuisine: 'Thai',
    level: 'Advanced',
  },
  {
    id: 5,
    title: 'Molten Chocolate Lava Cake Des',
    category: 'Desserts',
    image: cakeImg,
    rating: 4.6,
    time: '80 min',
    cuisine: 'Ethiopian',
    level: 'Advanced',
  },
];

export default function RecipeSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

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
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 relative"
          >
            <div className="absolute top-2 left-2 bg-yellow-400 text-white text-sm px-2 py-0.5 rounded font-bold shadow">
              ★ {recipe.rating}
            </div>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded-lg w-full h-40 object-cover"
            />
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
    </section>
  );
}
