import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getUsers, saveUsers, setCurrentUser } from "../utils/authUtils";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, avatar: reader.result });
      };
      if (files[0]) reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();
    const emailExists = users.some((u) => u.email === form.email);
    if (emailExists) return setError("Email already exists.");

    const newUser = {
      id: uuidv4(),
      ...form
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setCurrentUser(newUser);
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
