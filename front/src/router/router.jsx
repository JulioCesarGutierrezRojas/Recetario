import { Routes, Route, useLocation } from "react-router";
import Login from "../modules/auth/views/Login";
import NavBar from "../components/NavBar.jsx";

const AppRouter = () => {
    const location = useLocation();
    const isAdmin = localStorage.getItem("role") === "admin";

    return (
        <>
            { location.pathname !== "/" && <NavBar isAdmin={isAdmin} /> }
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </>
    );
};

export default AppRouter;