import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import Home from "../modules/recipes/views/Home";
import Recipe from "../modules/recipes/views/Recipe";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe" element={<Recipe />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;