import React from "react";
import { FiMenu } from "react-icons/fi";

const MenuButton = ({ toggleNavbar }) => {
  return (
    <div className="-mr-2 flex md:hidden">
      <button
        onClick={toggleNavbar}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:bg-white focus:text-jtBlue"
      >
        <FiMenu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MenuButton;
