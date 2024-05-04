import React from "react";
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link
          to="/adminpanel"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          My Tickets
        </Link>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          My Team
        </a>
      </div>
    </div>
  );
};

export default NavLinks;
