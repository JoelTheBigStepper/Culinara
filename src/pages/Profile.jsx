
import React from 'react';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-6">
        <img src="https://via.placeholder.com/100" alt="User Avatar" className="w-24 h-24 rounded-full" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">John Doe</h2>
      <p className="text-center text-gray-600 mb-6">Food Enthusiast | Recipe Creator</p>
      <div className="text-center">
        <button className="bg-coral-600 text-white py-2 px-4 rounded-lg mb-4">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
