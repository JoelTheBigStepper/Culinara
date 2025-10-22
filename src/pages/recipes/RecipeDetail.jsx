// src/pages/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../../utils/api";
import { getCurrentUser } from "../../utils/authUtils";
import {
  Clock,
  Users,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  Edit2,
  Trash2,
} from "lucide-react";

/**
 * Platea-like recipe detail layout:
 * - Left: hero image, title, description, ingredients, steps
 * - Right: sticky sidebar with meta (prep/cook/serves/difficulty), author, tags, actions
 *
 * Note: Tailwind classes used; tweak colors/spacings to match your theme.
 */

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        const user = getCurrentUser();
        if (user && data?.userId === String(user.id)) setIsOwner(true);
      } catch (err) {
        console.error(err);
        setError("Recipe not found or failed to fetch.");
      } finally {
        setLoading(false);
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!recipe) return null;

  // fallback helpers
  const image = recipe.image || recipe.images?.[0] || "https://via.placeholder.com/1200x800";
  const authorName = recipe.authorName || recipe.userName || recipe.author || "Unknown";
  const createdAtDisplay = recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Top hero section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT / MAIN (span 2) */}
        <main className="lg:col-span-2 space-y-6">
          {/* Hero image + title overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img src={image} alt={recipe.title} className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute left-6 bottom-6 text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-md">
                {recipe.title}
              </h1>
              <p className="mt-2 text-sm md:text-base max-w-2xl opacity-90">{recipe.description}</p>
              <div className="mt-4 flex items-center gap-3 text-sm md:text-base">
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" /> {recipe.prepTime || "—"} + {recipe.cookTime || "—"} mins
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" /> {recipe.servings || "—"} servings
                </span>
              </div>
            </div>
          </div>

          {/* meta row (mobile) */}
          <div className="lg:hidden flex items-center justify-between bg-white rounded-lg p-3 shadow">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.prepTime}/{recipe.cookTime}</div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {recipe.servings || "—"}</div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500" />
              <Share2 className="w-5 h-5" />
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          {/* Ingredients card */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ingredients</h2>
              <span className="text-sm text-gray-500">Serves {recipe.servings || "—"}</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(recipe.ingredients || []).map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 text-amber-600"><ChevronRight className="w-4 h-4" /></span>
                  <span className="text-gray-700">{typeof ing === "string" ? ing : ing.name || JSON.stringify(ing)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps / Directions */}
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold">Directions</h2>

            {(recipe.steps || []).map((step, idx) => {
              const instruction = typeof step === "string" ? step : step.instruction || "";
              const stepImage = typeof step === "object" && step.image ? step.image : null;
              return (
                <article key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-1">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="md:col-span-11 space-y-2">
                    <p className="text-gray-800 leading-relaxed">{instruction}</p>
                    {stepImage && <img src={stepImage} alt={`step-${idx+1}`} className="rounded-lg w-full object-cover max-h-[360px]" />}
                  </div>
                </article>
              );
            })}
          </section>

          {/* Additional info / notes */}
          {recipe.notes && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700">{recipe.notes}</p>
            </section>
          )}
        </main>

        {/* RIGHT / SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="sticky top-20">
            {/* Author card */}
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <img
                  src={recipe.authorAvatar || recipe.avatar || "https://via.placeholder.com/80"}
                  alt={authorName}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              </div>
              <div className="text-sm text-gray-600">Recipe by</div>
              <div className="font-medium mt-1">{authorName}</div>
              <div className="text-xs text-gray-400 mt-1">{createdAtDisplay}</div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-red-500" /> Like
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Owner edit/delete (small) */}
              {isOwner && (
                <div className="mt-4 flex gap-2 justify-center">
                  <Link to={`/edit-recipe/${id}`} className="px-3 py-2 rounded-md bg-amber-500 text-white flex items-center gap-2 text-sm">
                    <Edit2 className="w-4 h-4" /> Edit
                  </Link>
                  <button onClick={handleDelete} className="px-3 py-2 rounded-md bg-red-500 text-white flex items-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Stats / Quick meta */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Prep</div>
                <div className="font-medium">{recipe.prepTime || "—"} mins</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Cook</div>
                <div className="font-medium">{recipe.cookTime || "—"} mins</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Serves</div>
                <div className="font-medium">{recipe.servings || "—"}</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">Difficulty</div>
                <div className="font-medium">{recipe.difficulty || "—"}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h4 className="text-sm font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.cuisine && <Link to={`/cuisine/${recipe.cuisine}`} className="text-xs px-3 py-1 bg-gray-100 rounded-full">#{recipe.cuisine}</Link>}
                {recipe.category && <Link to={`/category/${recipe.category}`} className="text-xs px-3 py-1 bg-gray-100 rounded-full">#{recipe.category}</Link>}
                {(recipe.tags || []).map((t, i) => <Link key={i} to={`/search?query=${encodeURIComponent(t)}`} className="text-xs px-3 py-1 bg-gray-100 rounded-full">#{t}</Link>)}
              </div>
            </div>

            {/* Save / Bookmark big */}
            <div className="bg-white rounded-lg shadow p-4 mt-4 text-center">
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                <Bookmark className="w-4 h-4" /> Save to favorites
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
