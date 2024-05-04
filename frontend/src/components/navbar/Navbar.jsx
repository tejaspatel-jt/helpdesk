import React, { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./Navlink";
import UserIconMenu from "./UserIconMenu";
import MenuButton from "./MenuButton";
import MobileMenu from "./MobileMenu";

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <NavLinks />
          </div>
          <UserIconMenu onLogout={onLogout} />
          <MenuButton toggleNavbar={toggleNavbar} />
        </div>
      </div>
      <MobileMenu isOpen={isOpen} />
    </nav>
  );
};

export default Navbar;
