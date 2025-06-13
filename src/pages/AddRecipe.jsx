import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getCurrentUser } from "../utils/authUtils";

function SortableStep({ id, value, index, onChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <textarea
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        className="w-full border rounded px-4 py-2"
        placeholder={`Step ${index + 1}`}
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
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (i, value) => {
    const updated = [...ingredients];
    updated[i] = value;
    setIngredients(updated);
  };

  const handleStepChange = (i, value) => {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex((_, i) => `step-${i}` === active.id);
      const newIndex = steps.findIndex((_, i) => `step-${i}` === over?.id);
      setSteps((steps) => arrayMove(steps, oldIndex, newIndex));
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
    localStorage.setItem("recipes", JSON.stringify([...existing, newRecipe]));

    alert("Recipe added successfully!");
    navigate("/recipes/new");

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
        {/* ...Other inputs: title, image, ingredients, etc... */}

        {/* Steps with Drag & Drop */}
        <div>
          <label className="block text-sm font-medium mb-2">Steps (Drag to reorder)</label>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={steps.map((_, i) => `step-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step, i) => (
                <SortableStep
                  key={`step-${i}`}
                  id={`step-${i}`}
                  index={i}
                  value={step}
                  onChange={handleStepChange}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className="text-sm text-[#FF6F61] hover:underline mt-2"
          >
            + Add Step
          </button>
        </div>

        {/* ...Other inputs: time, difficulty, cuisine, category... */}

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
