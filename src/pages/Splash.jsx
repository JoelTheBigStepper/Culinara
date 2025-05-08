import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from '../assets/chef-logo.png';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center">
      <img
            src={myImage}
            loading="lazy"
            alt="Culinara logo"
           className="h-20 w-20 mb-4" 
          />
      <h1 className="text-3xl font-bold text-[#FF6F61]">Culinara</h1>
      <p className="text-gray-700 mt-2">Bringing Flavor to Your Fingertips</p>
    </div>
  );
}
