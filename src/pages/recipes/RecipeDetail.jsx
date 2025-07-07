import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById } from '../../utils/api';
import {
  Clock,
  UtensilsCrossed,
  ChefHat,
  Users,
  CheckCircle,
} from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecipeById(id)
      .then(setRecipe)
      .catch(() => setError('Recipe not found.'));
  }, [id]);

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
    if (!level) return 'text-gray-400';
    switch (level.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <img
        src={image}
        alt={title}
        className="w-full max-h-[500px] object-cover rounded-xl shadow mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {authorName && <p className="text-gray-600 mb-4">By {authorName}</p>}
      {rating && (
        <div className="inline-flex items-center gap-1 text-yellow-500 mb-4">
          <CheckCircle size={18} /> <span className="font-medium">{rating}</span>
        </div>
      )}

      {/* Meta Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span>
            <strong>Prep:</strong> {prepTime || 'N/A'} mins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span>
            <strong>Cook:</strong> {cookTime || 'N/A'} mins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={16} className="text-gray-500" />
          <span>{cuisine || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat size={16} className="text-gray-500" />
          <span className={getDifficultyColor(difficulty)}>{difficulty || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span>{servings ? `${servings} servings` : 'N/A'}</span>
        </div>
      </div>

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
                {typeof step === 'string' ? (
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
          className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
