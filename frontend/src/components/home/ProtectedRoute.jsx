import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";

// const ProtectedRoute = ({ children: Component, isAuthenticated }) => {
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProtectedRoute;
