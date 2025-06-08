import React, { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

 useEffect(() => {
  const current = getCurrentUser();
  if (!current) return navigate("/signin");
  setUser(current);
}, [navigate]);


  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-red-500"
        />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-500 hover:bg-red-50 py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
