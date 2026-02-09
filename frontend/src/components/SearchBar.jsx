// import { div } from 'framer-motion/client';
import { useState } from 'react';
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex w-full mt-4 rounded-md shadow-lg overflow-hidden">
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes, ingredients, cuisines..."
        className="flex-grow px-6 py-4 text-lg outline-none bg-white"
      />
        <button type='submit' className="bg-[#FF6F61] text-white w-16 flex items-center justify-center hover:bg-[#e05c4f] transition">
            <Search className="w-6 h-6" />
        </button>
    </form>
    </div>
  );
}
