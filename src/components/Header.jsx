import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserCircle,
  Plus,
  Bookmark,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
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
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const containerRef = useRef(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const toggleMobileDropdown = (label) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset dropdowns when mobile nav is closed
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileDropdowns({});
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="bg-white fixed top-0 left-0 w-full z-50">
        <div
          className="max-w-7xl mx-auto px-4 py-2 md:px-6 flex justify-between items-center"
          ref={containerRef}
        >
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center text-xl font-bold text-red-600"
          >
            <img
              src={myImage}
              alt="Culinara logo"
              className="h-10 w-10 sm:h-14 sm:w-14"
            />
            <span className="ml-2 text-xl">Culinara</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 relative">
            {navItems.map(({ label, items }) => (
              <div key={label} className="relative">
                <button
                  onClick={() => toggleDropdown(label)}
                  className="flex items-center text-gray-800 hover:text-red-600 font-medium"
                >
                  {label}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown === label && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded shadow-md py-2 z-50">
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

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/favorites">
              <Bookmark className="w-5 h-5 text-gray-600 hover:text-red-500" />
            </Link>
            <Search className="w-5 h-5 text-gray-600 hover:text-red-500" />
            <Link to="/profile">
              <UserCircle className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </Link>
            <Link
              to="/add"
              className="flex items-center px-3 py-2 bg-stone-200 text-black text-sm font-medium rounded hover:bg-red-600 hover:text-white transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Recipe
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden z-50">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-lg z-40 px-4 py-6 space-y-4 md:hidden">
          {navItems.map(({ label, items }) => (
            <div key={label}>
              <button
                onClick={() => toggleMobileDropdown(label)}
                className="flex justify-between w-full text-left text-gray-800 font-semibold"
              >
                {label}
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    mobileDropdowns[label] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdowns[label] && (
                <div className="pl-4 mt-1 space-y-1">
                  {items.map(({ name, path }) => (
                    <Link
                      key={name}
                      to={path}
                      className="block text-gray-600 hover:text-red-500 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
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
              className="flex items-center px-3 py-2 bg-stone-200 text-black text-sm font-medium rounded hover:bg-red-600 hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Recipe
            </Link>
          </div>
        </div>
      )}

      {/* Page top padding to push content below header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
