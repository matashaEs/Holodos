import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './components/login/Login';
import Registration from './components/registration/Registration';
import Reset from './components/reset/Reset';
import Home from './components/home/Home';
import Recipes from './components/recipes/Recipes';
import SingleRecipe from './components/recipes/SingleRecipe';
import Favorites from './components/favorites/Favorites';
import Products from './components/products/Products';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<SingleRecipe />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-products" element={<Products />} />
      </Routes>
    </Router>
  );
}