import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { uploadImageToCloudinary } from "../utils/cloudinary"; // ✅ Cloudinary helper
import toast, { Toaster } from "react-hot-toast";

const MOCK_API_BASE_URL = "https://6862fce088359a373e93a76f.mockapi.io/api/v1";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files && files[0]) {
      setUploading(true);
      try {
        const imageUrl = await uploadImageToCloudinary(files[0]);
        setForm((prev) => ({ ...prev, avatar: imageUrl }));
        toast.success("Avatar uploaded successfully!");
      } catch (err) {
        toast.error("Avatar upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if email already exists
      const { data: users } = await axios.get(`${MOCK_API_BASE_URL}/users`);
      const emailExists = users.some(
        (u) => u.email === form.email.trim().toLowerCase()
      );
      if (emailExists) {
        setError("Email already exists.");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        name: form.name,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        avatar: form.avatar
      };

      const { data: createdUser } = await axios.post(
        `${MOCK_API_BASE_URL}/users`,
        newUser
      );

      localStorage.setItem("currentUser", JSON.stringify(createdUser));
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">
          Sign Up
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm rounded px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="block mb-1 font-medium text-gray-700">
              Upload Avatar (Optional)
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={uploading}
              className="w-full text-sm"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-red-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
