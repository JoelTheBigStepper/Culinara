import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getRecipeById,
  deleteRecipe
} from "../../utils/api";
import { getCurrentUser } from "../../utils/authUtils";
import {
  Clock,
  UtensilsCrossed,
  ChefHat,
  Users,
  CheckCircle,
  Trash,
  Pencil
} from "lucide-react";

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

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );

  if (!recipe) return <div className="p-6 text-center">Loading recipe...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={recipe.image || "https://via.placeholder.com/800x600"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {recipe.title}
          </h1>
          <p className="max-w-2xl text-lg opacity-90">{recipe.description}</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="max-w-5xl mx-auto px-6 py-8 bg-white -mt-16 rounded-lg shadow-lg relative z-10">
        <div className="flex flex-wrap justify-center gap-6 text-gray-700 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" /> {recipe.cookTime} mins
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" /> Serves {recipe.servings}
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-600" /> {recipe.cuisine}
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-600" />{" "}
            {recipe.category}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link
            to={`/cuisine/${recipe.cuisine}`}
            className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition"
          >
            #{recipe.cuisine}
          </Link>
          <Link
            to={`/category/${recipe.category}`}
            className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition"
          >
            #{recipe.category}
          </Link>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex justify-center gap-4 mt-8">
            <Link
              to={`/edit-recipe/${id}`}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              <Trash className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto mt-12 px-6 md:px-0 grid md:grid-cols-3 gap-12">
        {/* Left Column: Ingredients */}
        <div className="md:col-span-1 bg-white shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-amber-700">
            Ingredients
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-700 leading-snug"
              >
                <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Steps */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-amber-700">
            How to Prepare
          </h2>
          <div className="space-y-8">
            {recipe.steps?.map((step, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Step {index + 1}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.instruction || step}
                </p>
                {step.image && (
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    className="rounded-lg shadow-md w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="max-w-5xl mx-auto mt-16 mb-12 px-6 text-center">
        <p className="text-gray-600 text-sm">
          Recipe by{" "}
          <span className="font-semibold text-amber-700">
            {recipe.authorName || "Unknown Chef"}
          </span>
        </p>
      </div>
    </div>
  );
}
