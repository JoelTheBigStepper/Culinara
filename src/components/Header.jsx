import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, UserCircle, Plus, Bookmark, Menu, X } from "lucide-react";
import myImage from "../assets/chef-logo.png";

const navItems = [
  {
    label: "Recipes",
    items: [
      { name: "All Recipes", path: "/recipes/all" },
      { name: "Trending", path: "/recipes/trending" },
      { name: "New", path: "/recipes/new" },
      { name: "My Recipes", path: "/recipes/my-recipes" },
    ],
  },
  {
    label: "Cuisines",
    items: [
      { name: "Italian", path: "/cuisines/italian" },
      { name: "Nigerian", path: "/cuisines/nigerian" },
      { name: "American", path: "/cuisines/american" },
      { name: "French", path: "/cuisines/french" },
      { name: "Mexican", path: "/cuisines/mexican" },
      { name: "Thai", path: "/cuisines/thai" },
    ],
  },
  {
    label: "Categories",
    items: [
      { name: "Vegan", path: "/categories/vegan" },
      { name: "Dessert", path: "/categories/dessert" },
      { name: "Breakfast", path: "/categories/breakfast" },
      { name: "Lunch", path: "/categories/lunch" },
      { name: "Dinner", path: "/categories/dinner" },
      { name: "Appetizer", path: "/categories/appetizer" },
      { name: "Quick Meals", path: "/categories/quick-meals" },
    ],
  },
  {
    label: "Blog",
    items: [
      { name: "Tips", path: "/blog/tips" },
      { name: "Stories", path: "/blog/stories" },
      { name: "Nutrition", path: "/blog/nutrition" },
    ],
  },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <img src={myImage} alt="Culinara logo" className="h-12 w-12 sm:h-16 sm:w-16" />
          <span className="ml-1 text-lg sm:text-xl">Culinara</span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-6 space-y-4 border-t shadow-sm">
          {navItems.map(({ label, items }) => (
            <div key={label}>
              <h4 className="text-gray-700 font-semibold mb-1">{label}</h4>
              <div className="space-y-1">
                {items.map(({ name, path }) => (
                  <Link
                    key={name}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-red-500"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Mobile Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
              <Bookmark className="w-5 h-5 text-gray-600 hover:text-red-500" />
            </Link>
            <Search className="w-5 h-5 text-gray-600 hover:text-red-500" />
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
              <UserCircle className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </Link>
            <Link
              to="/add"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 bg-stone-200 text-black text-sm font-medium rounded hover:bg-red-600 hover:text-white transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Recipe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
