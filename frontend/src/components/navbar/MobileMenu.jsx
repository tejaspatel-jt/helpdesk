import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ isOpen }) => {
  return (
    <div className={isOpen ? "md:hidden" : "hidden"}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          to="/home"
          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          My Tickets
        </Link>
        <Link
          to="/raisedtickets"
          className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Raised Tickets
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
