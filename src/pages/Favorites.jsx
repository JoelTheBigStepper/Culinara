
import React from 'react';

const Favorites = () => {
  const favoriteRecipes = [
    { title: 'Avocado Toast', time: '10 mins', rating: 4.5 },
    { title: 'Vegan Pancakes', time: '15 mins', rating: 4.8 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">My Favorites</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favoriteRecipes.map((recipe, index) => (
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

export default Favorites;
