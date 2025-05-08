import { Link } from "react-router-dom";
import { Search, UserCircle, Plus } from "lucide-react";
import { useState } from "react";
import myImage from "../assets/chef-logo.png";


const navItems = [
  { label: "Recipes", items: ["All Recipes", "Trending", "New"] },
  { label: "Cuisines", items: ["Italian", "Indian", "Mexican"] },
  { label: "Categories", items: ["Vegan", "Desserts", "Quick Meals"] },
  { label: "Blog", items: ["Tips", "Stories", "Nutrition"] },
];

export default function Header() {
  const [hovered, setHovered] = useState(null);

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center text-xl font-bold text-red-600">
        <img
            src={myImage}
            loading="lazy"
            alt="Culinara logo"
           className="h-20 w-20"
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
                <div className="absolute top-10 left-0 bg-white border shadow-md rounded-md py-2 w-40 z-50">
                  {items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFEBD8]"
                    >
                      {item}
                    </a>
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
