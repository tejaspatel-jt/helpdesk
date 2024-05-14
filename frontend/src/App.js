import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/home/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/ProfilePage";
import RaisedTickets from "./pages/RaisedTickets";
import TicketDetailsPage from "./pages/TicketDetailsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing access token on app load
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };
  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<LoginPage handleLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={<LoginPage handleLogin={handleLogin} />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          <Route path="/profile" element={<MyProfile />} />
          <Route
            path="/raisedtickets"
            element={<RaisedTickets onLogout={handleLogout} />}
          />
          <Route path="/ticketDetailsPage" element={<TicketDetailsPage />} />
          <Route
            path="/ticketDetailsPage:ticket_id"
            element={<TicketDetailsPage />}
          />
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
    </>
  );
}
export default App;
