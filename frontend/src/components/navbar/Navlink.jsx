import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MyRoutes, UserRole } from "../../common/common.config";

const NavLinks = ({ userRole }) => {
  const location = useLocation();
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {userRole === UserRole.MASTER ? (
          <NavLink
            to={MyRoutes.ADMIN_DASHBOARD}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname == MyRoutes.ADMIN_DASHBOARD
                ? "text-jtBlue bg-white"
                : "text-white"
            }`}
          >
            Dashboard
          </NavLink>
        ) : (
          ""
        )}

        <NavLink
          to={MyRoutes.MY_TICKETS}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname == MyRoutes.MY_TICKETS
              ? "text-jtBlue bg-white"
              : "text-white"
          }`}
        >
          My Tickets
        </NavLink>
        {!(userRole === UserRole.EMPLOYEE) ? (
          <NavLink
            to={MyRoutes.RAISED_TICKETS}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname == MyRoutes.RAISED_TICKETS
                ? "text-jtBlue bg-white"
                : "text-white"
            }`}
          >
            Raised Tickets
          </NavLink>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default NavLinks;
