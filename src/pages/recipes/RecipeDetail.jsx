// src/pages/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../../utils/api";
import { getCurrentUser } from "../../utils/authUtils";
import { Clock, UtensilsCrossed, ChefHat, Users, CheckCircle, Trash, Pencil, } from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);

        // Check if logged-in user owns this recipe
        const user = getCurrentUser();
        if (user && data?.userId === user.id) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error(err);
        setError("Recipe not found or failed to fetch.");
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe.");
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  if (!recipe) {
    return <div className="p-6 text-center">Loading recipe...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Recipe Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={recipe.image || "https://via.placeholder.com/400"}
          alt={recipe.title}
          className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
        />

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="text-gray-600">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> {recipe.cookingTime} mins
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" /> {recipe.cuisine}
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" /> {recipe.category}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Serves {recipe.servings}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              to={`/cuisine/${recipe.cuisine}`}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
            >
              #{recipe.cuisine}
            </Link>
            <Link
              to={`/category/${recipe.category}`}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition"
            >
              #{recipe.category}
            </Link>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-3 mt-6">
              <Link
                to={`/edit-recipe/${id}`}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul className="list-disc pl-6 space-y-1">
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Steps</h2>
        <ol className="list-decimal pl-6 space-y-4">
          {recipe.steps?.map((step, index) => (
            <li key={index} className="space-y-2">
              <p>{step.instruction || step}</p>
              {step.image && (
                <img
                  src={step.image}
                  alt={`Step ${index + 1}`}
                  className="rounded-lg shadow-md max-w-full"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
