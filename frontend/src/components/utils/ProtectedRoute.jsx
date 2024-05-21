import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import { MyRoutes } from "../../common/common.config";

// const ProtectedRoute = ({ children: Component, isAuthenticated }) => {
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={MyRoutes.DEFAULT} />;
};

export default ProtectedRoute;
