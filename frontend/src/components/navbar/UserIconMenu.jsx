import React, { useContext, useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import { useAuth } from "../contexts/AuthContextProvider";
import { MyRoutes } from "../../common/common.config";
import DialogModal from "../modal/DialogModal";
import ApiService from "../../ApiUtils/Api";

const UserIconMenu = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const apiService = new ApiService(setLoading);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await apiService.logout();
      if (response.status === 200) {
        logout();
        navigate(MyRoutes.DEFAULT, { replace: true });
      }
    } catch (error) {
      console.log(" usericonmenu ma error logging out", error);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center p-2 rounded-full text-gray-200 hover:text-gray-500 focus:outline-none focus:text-gray-500"
        onClick={toggleMenu}
      >
        <FaUser className="w-6 h-6" />
        <span className="ml-1">{userDetails.username}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg"
          ref={menuRef}
        >
          <div className="py-1">
            <Link
              to={MyRoutes.PROFILE}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              My Profile
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-200"
            >
              Log out
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <DialogModal
          title={"Confirmation"}
          message={"Are you Sure you want to Logout ?"}
          closeButtonOnClick={() => setModalOpen(false)}
          button2Name={"Logout"}
          button2StyleExtra={"btn"}
          button2Click={handleLogout}
        />
      )}
    </div>
  );
};

export default UserIconMenu;
