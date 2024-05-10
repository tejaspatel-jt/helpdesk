import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const NavLinks = ({ userRole }) => {
  const location = useLocation();
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <NavLink
          to="/home"
          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === "/home" ? "bg-gray-700 text-white" : ""
          }`}
        >
          My Tickets
        </NavLink>
        {!(userRole === "employee") && (
          <NavLink
            to="/raisedtickets"
            className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === "/adminpanel"
                ? "bg-gray-700 text-white"
                : ""
            }`}
          >
            Raised Tickets
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
