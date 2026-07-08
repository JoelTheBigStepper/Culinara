import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({ name: "", password: "", avatar: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/signin");
    setForm({ name: user.name || "", password: "", avatar: user.avatar || "" });
  }, [user, navigate]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setUploading(true);
      try {
        const imageUrl = await uploadImageToCloudinary(files[0]);
        setForm((prev) => ({ ...prev, avatar: imageUrl }));
        toast.success("Avatar uploaded!");
      } catch {
        toast.error("Avatar upload failed.");
      } finally {
        setUploading(false);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // Only send password if user typed one
      const payload = { name: form.name, avatar: form.avatar };
      if (form.password) payload.password = form.password;

      await updateUser(payload);
      toast.success("Profile updated!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
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
            value={user?.email || ""}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">New Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
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
            disabled={uploading}
            className="w-full border p-2 rounded"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={uploading || loading}
            className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
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