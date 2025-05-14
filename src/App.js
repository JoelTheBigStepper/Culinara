import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
// import RecipeSection from "./components/RecipeSection";
import RecipeDetail from "./pages/recipes/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import MyRecipes from "./pages/recipes/MyRecipes";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import CuisinePage from './pages/CuisinePage';
import CategoryPage from './pages/CategoryPage';

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
          <Route path="/recipes/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cuisines/:cuisine" element={<CuisinePage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}
