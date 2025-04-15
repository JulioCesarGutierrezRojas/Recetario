import { Routes, Route, useLocation } from "react-router";
import Login from "../modules/auth/views/Login";
import NavBar from "../components/NavBar.jsx";
import Home from "../modules/recipes/views/Home.jsx";
import Recipe from "../modules/recipes/views/Recipe.jsx";
import PasswordReset from "../modules/auth/views/RecoverPassword.jsx";
import MyRecipes from "../modules/recipes/views/MyRecipes.jsx";
import RecipeForm from "../modules/recipes/views/RecipeForm.jsx";

const AppRouter = () => {
    const location = useLocation();
    const isAdmin = localStorage.getItem("role") === "admin";

    const hiddenNavBar = ['/', '/signup', '/forgot-password'];

    return (
        <>
            { !hiddenNavBar.includes(location.pathname) && <NavBar isAdmin={isAdmin} /> }
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/recipe" element={<Recipe />} />
            </Routes>
        </>
    );
};

export default AppRouter;