import React from "react";
import { Search } from "lucide-react";
import RecipeSection from "../components/RecipeSection";
import myImage from "../assets/chef-logo.png";
import bgImage from "../assets/background.jpg";

const Home = () => {
  return (
    <div>
      <div
        className="h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="flex flex-col items-start space-y-6 bg-white/70 p-8 rounded-lg max-w-xl shadow-xl">
            <div className="flex items-center space-x-4">
              <img src={myImage} alt="Culinara logo" className="h-16 w-16 object-contain" />
              <h1 className="text-4xl font-bold text-[#2E2E2E]">Bringing Flavor to Your Fingertips</h1>
            </div>
            <div className="flex w-full mt-4 rounded-md shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search recipes, ingredients, cuisines..."
                className="flex-grow px-6 py-4 text-lg outline-none bg-white"
              />
              <button className="bg-[#FF6F61] text-white w-16 flex items-center justify-center hover:bg-[#e05c4f] transition">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <RecipeSection/>
    </div>
  );
};

export default Home;
