import { Routes, Route, useLocation } from "react-router";
import Login from "../modules/auth/views/Login";
import NavBar from "../components/NavBar.jsx";
import Home from "../modules/recipes/views/Home.jsx";
import Recipe from "../modules/recipes/views/Recipe.jsx";
import { UserList } from "../modules/users/views/UserList";

const AppRouter = () => {
    const location = useLocation();
    const isAdmin = localStorage.getItem("role") === "admin";

    return (
        <>
            { location.pathname !== "/" && <NavBar isAdmin={isAdmin} /> }
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/recipe" element={<Recipe />} />
                <Route path="/users/" element={<UserList />} />,
            </Routes>
        </>
    );
};

export default AppRouter;