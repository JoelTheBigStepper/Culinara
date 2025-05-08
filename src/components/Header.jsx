import { Link } from 'react-router-dom';
import { Search, UserCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import myImage from '../assets/chef-logo.png';

const navItems = [
  {
    label: 'Recipes',
    items: [
      { name: 'All Recipes', path: '/recipes' },
      { name: 'Trending', path: '/recipes/trending' },
      { name: 'New', path: '/recipes/new' },
    ],
  },
  {
    label: 'Cuisines',
    items: [
      { name: 'Italian', path: '/cuisines/italian' },
      { name: 'Indian', path: '/cuisines/indian' },
      { name: 'Mexican', path: '/cuisines/mexican' },
    ],
  },
  {
    label: 'Categories',
    items: [
      { name: 'Vegan', path: '/categories/vegan' },
      { name: 'Desserts', path: '/categories/desserts' },
      { name: 'Quick Meals', path: '/categories/quick-meals' },
    ],
  },
  {
    label: 'Blog',
    items: [
      { name: 'Tips', path: '/blog/tips' },
      { name: 'Stories', path: '/blog/stories' },
      { name: 'Nutrition', path: '/blog/nutrition' },
    ],
  },
];

export default function Header() {
  const [hovered, setHovered] = useState(null);

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/home" className="flex items-center text-xl font-bold text-pink-600">
          <img
            src={myImage}
            loading="lazy"
            alt="Culinara logo"
            className="h-12 w-12 object-contain mr-2"
          />
          <span>Culinara</span>
        </Link>

        {/* Nav Items */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map(({ label, items }) => (
            <div
              key={label}
              className="relative group"
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
            >
              <button className="text-gray-800 hover:text-[#FF6F61] font-medium">
                {label}
              </button>
              {hovered === label && (
                <div className="absolute top-10 left-0 bg-white border shadow-md rounded-md py-2 w-44 z-50">
                  {items.map(({ name, path }) => (
                    <Link
                      key={name}
                      to={path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFEBD8]"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-600 hover:text-[#FF6F61] cursor-pointer" />
          <UserCircle className="w-6 h-6 text-gray-600 hover:text-[#FF6F61] cursor-pointer" />
          <Link
            to="/add"
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Recipe
          </Link>
        </div>
      </div>
    </header>
  );
}
