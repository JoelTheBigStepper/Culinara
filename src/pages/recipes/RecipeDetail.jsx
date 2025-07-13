import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../../utils/api";
import {
  Clock,
  UtensilsCrossed,
  ChefHat,
  Users,
  CheckCircle,
  Trash,
  Pencil,
} from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    getRecipeById(id)
      .then((res) => {
        setRecipe(res.data);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && res.data.userId === user.id) {
          setIsOwner(true);
        }
      })
      .catch(() => setError("Recipe not found."));
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirm) return;

    try {
      await deleteRecipe(id);
      navigate("/home");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting recipe.");
    }
  };

  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!recipe) return <div className="text-center mt-8">Loading...</div>;

  const {
    title,
    image,
    description,
    ingredients = [],
    steps = [],
    prepTime,
    cookTime,
    cuisine,
    difficulty,
    servings,
    rating,
    authorName,
  } = recipe;

  const getDifficultyColor = (level) => {
    if (!level) return "text-gray-400";
    switch (level.toLowerCase()) {
      case "easy":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <img
        src={image}
        alt={title}
        className="w-full max-h-[500px] object-cover rounded-xl shadow mb-6"
      />

      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {authorName && <p className="text-gray-600 mt-1">By {authorName}</p>}
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Link
              to={`/edit-recipe/${id}`}
              className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600"
            >
              <Pencil size={16} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600"
            >
              <Trash size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {rating && (
        <div className="inline-flex items-center gap-1 text-yellow-500 mb-4">
          <CheckCircle size={18} />
          <span className="font-medium">{rating}</span>
        </div>
      )}

      {/* Meta Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            <strong>Prep:</strong> {prepTime || "N/A"} mins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            <strong>Cook:</strong> {cookTime || "N/A"} mins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={16} />
          <span>{cuisine || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat size={16} />
          <span className={getDifficultyColor(difficulty)}>{difficulty || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{servings ? `${servings} servings` : "N/A"}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Steps</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {steps.map((step, index) => (
              <li key={index}>
                <p className="font-medium">Step {index + 1}</p>
                {typeof step === "string" ? (
                  <p>{step}</p>
                ) : (
                  <>
                    <p>{step.instruction}</p>
                    {step.image && (
                      <img
                        src={step.image}
                        alt={`Step ${index + 1}`}
                        className="w-full max-w-md mt-2 rounded"
                      />
                    )}
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/home"
          className="inline-block bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
