import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "../assets/chef-logo.png";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signup");
    }, 20000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <img
        src={myImage}
        loading="lazy"
        alt="Culinara logo"
        className="h-24 w-24 mb-6 animate-bounce-slow"
      />
      <h1 className="text-4xl font-bold text-[#FF6F61]">Culinara</h1>
      <p className="text-gray-700 mt-2 text-lg">Bringing Flavor to Your Fingertips</p>

      <div className="mt-6">
        <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400 mt-2">Loading...</p>
      </div>
    </div>
  );
}
