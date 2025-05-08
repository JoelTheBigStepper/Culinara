import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import RecipeSection from "./components/RecipeSection";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
// import Discover from "./pages/Discover";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Header from "./components/Header";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add" element={<AddRecipe />} />
          {/* <Route path="/discover" element={<Discover />} /> */}
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <RecipeSection/>
      </div>
    </Router>
  );
}
