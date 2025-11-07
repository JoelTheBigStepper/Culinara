import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import myImage from "../assets/chef-logo.png";
import bgImage from "../assets/splash_bg.jpg";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signup");
    }, 1000000); // 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src={myImage}
          loading="lazy"
          alt="Culinara logo"
 className="h-24 w-24 mb-6 animate-bounce-slow drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
        />
        <h1 className="text-4xl font-bold text-[#FF6F61] drop-shadow-lg">
          Culinara
        </h1>
        <p className="text-gray-100 mt-2 text-lg drop-shadow-sm">
          Bringing Flavor to Your Fingertips
        </p>

        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-200 mt-2">Loading...</p>
        </div>
      </div>
    </div>
  );
}
