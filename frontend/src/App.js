import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/home/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import MyTickets from "./pages/MyTickets";
import MyProfile from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  return (
    // <LoaderProvider>
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<LoginPage handleLogin={handleLogin} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route
          path="/home"
          element={
            // <Home />
            <ProtectedRoute
              children={<Home />}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </Router>
    // </LoaderProvider>
  );
}
export default App;
