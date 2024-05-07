import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";

const UserIconMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Perform any necessary logout operations (e.g., clearing user data)
    if (onLogout) {
      onLogout();
    }
    // Redirect to the login page or other appropriate page after logout
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center p-2 rounded-full text-gray-200 hover:text-gray-500 focus:outline-none focus:text-gray-500"
        onClick={toggleMenu}
      >
        <FaUser className="w-6 h-6" />
        <span className="ml-1">{userDetails.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIconMenu;
