import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import {  useState } from "react";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import EditProfile from "./pages/EditProfile";
import RecipeDetail from "./pages/recipes/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import MyRecipes from "./pages/recipes/MyRecipes";
import AllRecipes from "./pages/recipes/AllRecipes";
import NewRecipes from "./pages/recipes/NewRecipes";
import TrendingRecipes from "./pages/recipes/TrendingRecipes";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import CuisinePage from "./pages/CuisinePage";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header";

import "./App.css";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage = ["/signin", "/signup"].includes(path);
  const isSplash = path === "/";

  return (
    <div className="">
      {!isSplash && !isAuthPage && <Header />}


      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/recipes/my-recipes" element={<MyRecipes />} />
        <Route path="/recipes/all" element={<AllRecipes />} />
        <Route path="/recipes/new" element={<NewRecipes />} />
        <Route path="/recipes/trending" element={<TrendingRecipes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cuisines/:cuisine" element={<CuisinePage />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
