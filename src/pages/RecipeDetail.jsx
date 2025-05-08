
import React from 'react';

const RecipeDetail = () => {
  const recipe = {
    title: 'Avocado Toast',
    author: 'Chef John',
    time: '10 mins',
    rating: 4.5,
    ingredients: ['Avocado', 'Toast', 'Lemon', 'Salt'],
    steps: ['Toast the bread', 'Mash avocado', 'Spread on toast'],
    nutrition: { calories: '200 kcal', protein: '5g' },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <button className="text-coral-600">Back</button>
        <button className="bg-coral-600 text-white py-2 px-4 rounded-lg">Bookmark</button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <img src="https://via.placeholder.com/400x300" alt={recipe.title} className="w-full rounded-md" />
        <h2 className="font-semibold text-2xl mt-4">{recipe.title}</h2>
        <p className="text-gray-600">{recipe.author}</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{recipe.time}</span>
          <span>⭐ {recipe.rating}</span>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold">Ingredients</h3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-600">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold">Steps</h3>
          <ol className="list-decimal pl-5">
            {recipe.steps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ol>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold">Nutrition</h3>
          <p className="text-gray-600">Calories: {recipe.nutrition.calories}</p>
          <p className="text-gray-600">Protein: {recipe.nutrition.protein}</p>
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg">Start Cooking</button>
      </div>
    </div>
  );
};

export default RecipeDetail;
