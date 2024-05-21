import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/home/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/ProfilePage";
import RaisedTickets from "./pages/RaisedTickets";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import { AuthProvider } from "./components/contexts/AuthContextProvider";
import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="mytickets" element={<MyTickets />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="raisedtickets" element={<RaisedTickets />} />
              <Route path="ticketDetailsPage" element={<TicketDetailsPage />} />
              <Route path="/mytickets" element={<Navigate to="/mytickets" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
export default App;
