import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getCurrentUser } from "../utils/authUtils";
import { addRecipe } from "../utils/api";
import { uploadImageToCloudinary } from "../utils/cloudinary";

// 🔹 Sortable input field
function SortableItem({ id, value, onChange, placeholder }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

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

// 🔹 Sortable textarea
function SortableTextarea({ id, value, onChange, placeholder }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

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
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [cuisine, setCuisine] = useState("Nigerian");
  const [category, setCategory] = useState("Dessert");
  const [loading, setLoading] = useState(false);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("You must be signed in to add a recipe.");
      return navigate("/signin");
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // ✅ Match exact MockAPI schema
      const newRecipe = {
        title: title.trim(),
        image: imageUrl || "",
        description: description.trim(),
        createdAt: new Date(),
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        steps: steps.filter((s) => s.trim() !== ""),
        prepTime: prepTime.trim(),
        cookTime: cookTime.trim(),
        difficulty,
        cuisine,
        category,
        userId: String(currentUser.id),
      };

      console.log("📤 Sending recipe to /recipe endpoint:", newRecipe);

      const response = await addRecipe(newRecipe);
      console.log("✅ Recipe added:", response.data);

      alert("Recipe added successfully!");
      navigate("/recipes/new");
    } catch (error) {
      console.error("❌ Error adding recipe:", error.response?.data || error);
      alert("Error adding recipe. Check console for details.");
    } finally {
      setLoading(false);
    }
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        {/* Image Upload */}
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
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          <SortableContext
            items={ingredients.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
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
          <button
            type="button"
            onClick={() => setIngredients([...ingredients, ""])}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-2">Steps</label>
          <SortableContext
            items={steps.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
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
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className="text-sm text-red-500 hover:underline"
          >
            + Add Step
          </button>
        </div>

        {/* Time & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prep Time</label>
            <input
              type="text"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="e.g., 15 mins"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cook Time</label>
            <input
              type="text"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="e.g., 30 mins"
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
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
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
            <option value="Nigerian">Nigerian</option>
            <option value="Brazilian">Brazilian</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Chinese">Chinese</option>
            <option value="German">German</option>
            <option value="Mexican">Mexican</option>
            <option value="Greek">Greek</option>
            <option value="Indian">Indian</option>
            <option value="Spanish">Spanish</option>
            <option value="Thai">Thai</option>
            <option value="American">American</option>
            <option value="French">French</option>
            <option value="Turkish">Turkish</option>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700"
        >
          {loading ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
}
