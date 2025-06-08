import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from "../utils/authUtils";

export default function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [cuisine, setCuisine] = useState('Italian');
  const [category, setCategory] = useState('Dessert'); // 🔥 NEW

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert("You must be signed in to add a recipe.");
    return navigate("/signin");
  }

  const newRecipe = {
    id: Date.now(),
    title,
    image,
    ingredients,
    steps,
    prepTime,
    cookTime,
    difficulty,
    cuisine,
    category,
    userId: currentUser.id, // ✅ Tie recipe to logged-in user
    createdAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem("recipes")) || [];
  const updated = [...existing, newRecipe];
  localStorage.setItem("recipes", JSON.stringify(updated));

  alert("Recipe added successfully!");
  navigate("/recipes/new");

  // Reset form
  setTitle("");
  setImage(null);
  setIngredients([""]);
  setSteps([""]);
  setPrepTime("");
  setCookTime("");
  setDifficulty("easy");
  setCuisine("Italian");
  setCategory("Dessert");
};

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Add a New Recipe</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium">Image Upload</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium">Ingredients</label>
          {ingredients.map((ing, i) => (
            <input
              key={i}
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
              className="w-full border rounded px-4 py-2 mb-2"
              placeholder={`Ingredient ${i + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={() => setIngredients([...ingredients, ''])}
            className="text-sm text-[#FF6F61] hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium">Steps</label>
          {steps.map((step, i) => (
            <textarea
              key={i}
              value={step}
              onChange={(e) => handleStepChange(i, e.target.value)}
              className="w-full border rounded px-4 py-2 mb-2"
              placeholder={`Step ${i + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={() => setSteps([...steps, ''])}
            className="text-sm text-[#FF6F61] hover:underline"
          >
            + Add Step
          </button>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prep Time</label>
            <input
              type="text"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cook Time</label>
            <input
              type="text"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium">Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Nigerian">Nigerian</option>
            <option value="Chinese">Chinese</option>
            <option value="American">American</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Greek">Greek</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
            <option value="Thai">Thai</option>
            <option value="Brazilian">Brazilian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 🔥 Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="Dessert">Dessert</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Side Dish">Side Dish</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
