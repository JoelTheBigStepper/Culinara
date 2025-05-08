
import React from 'react';

const categories = ['Breakfast', 'Vegan', 'Desserts', 'Lunch', 'Dinner'];
const recipes = [
  { title: 'Avocado Toast', time: '10 mins', rating: 4.5 },
  { title: 'Vegan Pancakes', time: '15 mins', rating: 4.8 },
];

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          className="border border-gray-300 rounded-lg py-2 px-4 w-2/3"
        />
        <button className="bg-pink-600 text-white py-2 px-4 rounded-lg">Add recipe</button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {categories.map((category, index) => (
            <div key={index} className="bg-gray-200 px-4 py-2 rounded-lg">{category}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-4">
            <img src="https://via.placeholder.com/150" alt={recipe.title} className="w-full rounded-md" />
            <h3 className="font-semibold text-lg mt-2">{recipe.title}</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{recipe.time}</span>
              <span>⭐ {recipe.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
