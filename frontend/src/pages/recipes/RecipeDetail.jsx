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

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch recipe
  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        const user = getCurrentUser();

        // Owner check
        if (user && data?.userId === String(user.id)) setIsOwner(true);

        // Likes & favorites load
        const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
        const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];

        setLikeCount(data.likes || 0);
        setLiked(!!storedLikes[id]?.includes(user?.id));
        setFavorites(storedFavs);
      } catch (err) {
        console.error(err);
        setError("Recipe not found or failed to fetch.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Like handler
  const handleLike = () => {
    const user = getCurrentUser();
    if (!user) return navigate("/signin");

    const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const userLikes = storedLikes[id] || [];

    if (userLikes.includes(user.id)) {
      // Unlike
      storedLikes[id] = userLikes.filter((uid) => uid !== user.id);
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // Like
      storedLikes[id] = [...userLikes, user.id];
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    localStorage.setItem("likes", JSON.stringify(storedLikes));
  };

  // Add/remove favorites
  const handleFavorite = () => {
    const user = getCurrentUser();
    if (!user) return navigate("/signin");

    const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavs;

    if (storedFavs.some((f) => f.id === recipe.id)) {
      updatedFavs = storedFavs.filter((f) => f.id !== recipe.id);
    } else {
      updatedFavs = [...storedFavs, recipe];
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  // Share recipe
  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: recipe.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

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
  const image =
    recipe.image ||
    recipe.images?.[0] ||
    "https://via.placeholder.com/1200x800";
  const authorName =
    recipe.authorName || recipe.userName || recipe.author || "Unknown";
  const createdAtDisplay = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString()
    : "";
  const isFavorited = favorites.some((f) => f.id === recipe.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <main className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt={recipe.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute left-6 bottom-6 text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-md">
                {recipe.title}
              </h1>
              <p className="mt-2 text-sm md:text-base max-w-2xl opacity-90">
                {recipe.description}
              </p>

              <div className="mt-4 flex items-center gap-3 text-sm md:text-base">
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" /> {recipe.prepTime || "—"} +{" "}
                  {recipe.cookTime || "—"} mins
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" /> {recipe.servings || "—"} servings
                </span>
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-4 text-gray-700">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-50 ${
                liked ? "text-red-500 border-red-300" : "border-gray-300"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
              />
              {likeCount}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
            >
              <Share2 className="w-5 h-5" /> Share
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-50 ${
                isFavorited ? "text-amber-600 border-amber-300" : "border-gray-300"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isFavorited ? "fill-amber-600 text-amber-600" : ""
                }`}
              />
              {isFavorited ? "Saved" : "Save"}
            </button>
          </div>

          {/* Ingredients */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(recipe.ingredients || []).map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-amber-600 mt-1" />
                  <span className="text-gray-700">
                    {typeof ing === "string" ? ing : ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold">Directions</h2>
            {(recipe.steps || []).map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-800">{step.instruction || step}</p>
                </div>
                {step.image && (
                  <img
                    src={step.image}
                    alt={`Step ${idx + 1}`}
                    className="rounded-lg w-full object-cover max-h-[360px]"
                  />
                )}
              </div>
            ))}
          </section>

          {/* Notes */}
          {recipe.notes && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700">{recipe.notes}</p>
            </section>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg shadow p-5 text-center">
              <img
                src={
                  recipe.authorAvatar ||
                  recipe.avatar ||
                  "https://via.placeholder.com/80"
                }
                alt={authorName}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border"
              />
              <p className="text-sm text-gray-600">Recipe by</p>
              <h4 className="font-medium text-gray-800">{authorName}</h4>
              <p className="text-xs text-gray-400">{createdAtDisplay}</p>

              {isOwner && (
                <div className="mt-4 flex gap-2 justify-center">
                  <Link
                    to={`/edit-recipe/${id}`}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.cuisine && (
                  <Link
                    to={`/cuisine/${recipe.cuisine}`}
                    className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    #{recipe.cuisine}
                  </Link>
                )}
                {recipe.category && (
                  <Link
                    to={`/category/${recipe.category}`}
                    className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    #{recipe.category}
                  </Link>
                )}
                {(recipe.tags || []).map((t, i) => (
                  <Link
                    key={i}
                    to={`/search?query=${encodeURIComponent(t)}`}
                    className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
