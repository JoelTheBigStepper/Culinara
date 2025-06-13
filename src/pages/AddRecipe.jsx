import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getCurrentUser } from "../utils/authUtils";

function SortableItem({ id, value, onChange, placeholder }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-4 py-2 mb-2"
        required
      />
    </div>
  );
}

function SortableTextarea({ id, value, onChange, placeholder }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <textarea
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-4 py-2 mb-2"
        required
      />
    </div>
  );
}

export default function AddRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [cuisine, setCuisine] = useState("Italian");
  const [category, setCategory] = useState("Dessert");

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

  const updateIngredient = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleIngredientDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      setIngredients((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleStepDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      setSteps((items) => arrayMove(items, oldIndex, newIndex));
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
      userId: currentUser.id,
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

        {/* Ingredients with drag-and-drop */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleIngredientDragEnd}>
            <SortableContext items={ingredients.map((_, i) => i)} strategy={verticalListSortingStrategy}>
              {ingredients.map((ing, index) => (
                <SortableItem
                  key={index}
                  id={index}
                  value={ing}
                  onChange={updateIngredient}
                  placeholder={`Ingredient ${index + 1}`}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            type="button"
            onClick={() => setIngredients([...ingredients, ""])}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps with drag-and-drop */}
        <div>
          <label className="block text-sm font-medium mb-2">Steps</label>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleStepDragEnd}>
            <SortableContext items={steps.map((_, i) => i)} strategy={verticalListSortingStrategy}>
              {steps.map((step, index) => (
                <SortableTextarea
                  key={index}
                  id={index}
                  value={step}
                  onChange={updateStep}
                  placeholder={`Step ${index + 1}`}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Step
          </button>
        </div>

        {/* Time Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Category */}
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
          className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
