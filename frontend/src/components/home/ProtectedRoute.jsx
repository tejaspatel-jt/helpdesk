import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children: Component, isAuthenticated }) => {
  return isAuthenticated ? Component : <Navigate to={"/"} />;
};

export default ProtectedRoute;
