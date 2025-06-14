import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUser } from "../utils/authUtils";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return navigate("/signin");
    setForm(currentUser);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      if (files[0]) reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    updateUser(form);
    toast.success("Profile updated successfully!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Toaster position="top-center" />

      <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
        {/* Avatar preview */}
        {form.avatar && (
          <div className="flex justify-center mb-4">
            <img
              src={form.avatar}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Avatar</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="border px-4 py-2 rounded w-full hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
