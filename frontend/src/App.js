import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/ProfilePage";
import RaisedTickets from "./pages/RaisedTickets";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import { AuthProvider } from "./components/contexts/AuthContextProvider";

import { MyRoutes } from "./common/common.config";

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
              <Route path={MyRoutes.HOME} element={<Home />} />
              <Route path={MyRoutes.PROFILE} element={<MyProfile />} />
              <Route
                path={MyRoutes.RASIED_TICKETS}
                element={<RaisedTickets />}
              />
              <Route
                path={MyRoutes.TICKET_DETAILS}
                element={<TicketDetailsPage />}
              />
              <Route
                path={MyRoutes.HOME}
                element={<Navigate to={MyRoutes.HOME} />}
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
export default App;
