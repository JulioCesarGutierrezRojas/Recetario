import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import { UserList } from "../modules/users/views/UserList";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />,
        <Route path="/users/" element={<UserList />} />,
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;