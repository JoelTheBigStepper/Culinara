import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../../utils/api";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeById(id);
        if (!currentUser || res.userId !== currentUser.id) {
          setUnauthorized(true);
        } else {
          setRecipe(res);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRecipe(id, recipe);
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update recipe.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (unauthorized) return <div className="text-center text-red-500 mt-8">Unauthorized Access</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={recipe.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
          required
        />
        {/* Add more fields as needed */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
}
