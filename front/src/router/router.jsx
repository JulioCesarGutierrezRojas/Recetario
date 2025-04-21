import { Routes, Route, useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router";
import { useEffect } from "react";
import Login from "../modules/auth/views/Login";
import NavBar from "../components/NavBar.jsx";
import Home from "../modules/recipes/views/Home.jsx";
import Recipe from "../modules/recipes/views/Recipe.jsx";
import PasswordReset from "../modules/auth/views/RecoverPassword.jsx";
import MyRecipes from "../modules/recipes/views/MyRecipes.jsx";
import RecipeForm from "../modules/recipes/views/RecipeForm.jsx";
import Register from "../modules/auth/views/Register.jsx";
import { UserList } from "../modules/users/views/UserList";
import { RecipesList } from "../modules/users/views/RecipesList.jsx";
import Mycomment from "../modules/comments/views/Mycomment.jsx";
import SearchResults from "../modules/recipes/views/SearchResults.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";

const AppRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("role") === "Administrador";
    const token = localStorage.getItem("token");

    const hiddenNavBar = ['/', '/signup', '/forgot-password'];

    // Check authentication on location changes
    useEffect(() => {
        // If user is logged in and tries to access a public route, redirect to home
        if (token && hiddenNavBar.includes(location.pathname)) {
            navigate('/home', { replace: true });
        }
    }, [location, token, navigate]);

    // Define roles
    const ADMIN_ROLE = "Administrador";
    const USER_ROLE = "Usuario";

    return (
        <>
            { !hiddenNavBar.includes(location.pathname) && <NavBar isAdmin={isAdmin} /> }
            <Routes>
                {/* Public routes - redirect to home if logged in */}
                <Route path="/" element={<PublicRoute element={<Login />} />} />
                <Route path="/forgot-password" element={<PublicRoute element={<PasswordReset />} />} />
                <Route path="/signup" element={<PublicRoute element={<Register />} />} />

                {/* Admin and User routes */}
                <Route path="/home" element={<ProtectedRoute element={<Home />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />
                <Route path="/recipe" element={<ProtectedRoute element={<Recipe />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />
                <Route path="/myrecipes" element={<ProtectedRoute element={<MyRecipes />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />
                <Route path="/mycomment" element={<ProtectedRoute element={<Mycomment />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />
                <Route path="/search" element={<ProtectedRoute element={<SearchResults />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />
                <Route path="/recipeform" element={<ProtectedRoute element={<RecipeForm />} allowedRoles={[ADMIN_ROLE, USER_ROLE]} />} />

                {/* Admin-only routes */}
                <Route path="/users/" element={<ProtectedRoute element={<UserList />} allowedRoles={[ADMIN_ROLE]} />} />
                <Route path="/userRecipes/" element={<ProtectedRoute element={<RecipesList />} allowedRoles={[ADMIN_ROLE]} />} />


                {/* Catch-all route - redirect to home if logged in, otherwise to login */}
                <Route path="*" element={
                    localStorage.getItem('token') 
                    ? <Navigate to="/home" replace /> 
                    : <Navigate to="/" replace />
                } />
            </Routes>
        </>
    );
};

export default AppRouter;
