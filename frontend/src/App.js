import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/ProfilePage";
import RaisedTickets from "./pages/RaisedTickets";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import { AuthProvider } from "./components/contexts/AuthContextProvider";
import MyTickets from "./pages/MyTickets";

import { MyRoutes } from "./common/common.config";
import HelpPage from "./pages/HelpPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path={MyRoutes.DEFAULT} element={<LoginPage />} />
            <Route
              path={MyRoutes.FORGOT_PASSWORD}
              element={<ForgotPassword />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path={MyRoutes.MY_TICKETS} element={<MyTickets />} />
              <Route path={MyRoutes.PROFILE} element={<MyProfile />} />
              <Route
                path={MyRoutes.RAISED_TICKETS}
                element={<RaisedTickets />}
              />
              <Route
                path={MyRoutes.TICKET_DETAILS}
                element={<TicketDetailsPage />}
              />
              <Route
                path={MyRoutes.ADMIN_DASHBOARD}
                element={<AdminDashboard />}
              />
              <Route path={MyRoutes.HELP_PAGE} element={<HelpPage />} />
              <Route
                path={MyRoutes.MY_TICKETS}
                element={<Navigate to={MyRoutes.MY_TICKETS} />}
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
export default App;
