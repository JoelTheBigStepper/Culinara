import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, UserCircle, Plus, Bookmark } from "lucide-react";
import myImage from "../assets/chef-logo.png";

const navItems = [
  {
    label: "Recipes",
    items: [
      { name: "All Recipes", path: "/home" },
      { name: "Trending", path: "/recipes/trending" },
      { name: "New", path: "/recipes/new" },
      { name: "My Recipes", path: "/recipes/my-recipes" } 
    ]
  },
  {
    label: "Cuisines",
    items: [
      { name: "Italian", path: "/cuisines/italian" },
      { name: "Indian", path: "/cuisines/indian" },
      { name: "Mexican", path: "/cuisines/mexican" }
    ]
  },
  {
    label: "Categories",
    items: [
      { name: "Vegan", path: "/categories/vegan" },
      { name: "Desserts", path: "/categories/desserts" },
      { name: "Quick Meals", path: "/categories/quick-meals" }
    ]
  },
  {
    label: "Blog",
    items: [
      { name: "Tips", path: "/blog/tips" },
      { name: "Stories", path: "/blog/stories" },
      { name: "Nutrition", path: "/blog/nutrition" }
    ]
  }
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2" ref={containerRef}>
        {/* Logo */}
        <Link to="/home" className="flex items-center text-xl font-bold text-red-600">
          <img src={myImage} alt="Culinara logo" className="h-16 w-16" />
          <span className="ml-1">Culinara</span>
        </Link>

        {/* Nav Items */}
        <nav className="hidden md:flex space-x-6 relative">
          {navItems.map(({ label, items }) => (
            <div key={label} className="relative">
              <button
                onClick={() => toggleDropdown(label)}
                className="text-gray-800 hover:text-[#FF6F61] font-medium"
              >
                {label}
              </button>
              {openDropdown === label && (
                <div className="absolute left-0 mt-2 w-44 bg-white border rounded-md shadow-md py-2 z-50">
                  {items.map(({ name, path }) => (
                    <Link
                      key={name}
                      to={path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFEBD8]"
                      onClick={() => setOpenDropdown(null)}
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
          <Link to="/favorites">
            <Bookmark className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
          </Link>
          <Search className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
          <Link to="/profile">
            <UserCircle className="w-6 h-6 text-gray-600 hover:text-red-500 cursor-pointer" />
          </Link>
          <Link
            to="/add"
            className="flex items-center px-3 py-2 bg-stone-200 text-black text-sm font-medium rounded hover:bg-red-600 hover:text-white transition"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Recipe
          </Link>
        </div>
      </div>
    </header>
  );
}
