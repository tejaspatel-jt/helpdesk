import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon"; // Import the logout icon

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary logout operations
    onLogout();
    // Redirect to the login page
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Top navigation brand or logo */}
        <div className="text-xl font-bold">Jignect Helpdesk</div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="text-white text-xl font-bold hover:underline flex items-center"
        >
          Logout
          <ArrowRightOnRectangleIcon className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
