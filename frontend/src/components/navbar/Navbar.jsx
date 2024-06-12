import React, { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./Navlink";
import UserIconMenu from "./UserIconMenu";
import MenuButton from "./MenuButton";
import MobileMenu from "./MobileMenu";
import { MyRoutes } from "../../common/common.config";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

const Navbar = ({ userRole, screen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <nav className="bg-jtBlue sticky top-0 z-20">
        <div className="mx-auto px-4 sm:px-5 lg:px-8 ">
          {/* <div className="flex items-center justify-between h-16"> */}

          {screen === MyRoutes.PROFILE ||
          screen === MyRoutes.TICKET_DETAILS ||
          screen === MyRoutes.HELP_PAGE ? (
            <div className="flex h-[68px] items-center ">
              <button
                onClick={() => goBack()}
                className="flex items-center text-xl text-white hover:text-gray-300 "
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1  " />
                Go Back
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-row justify-between h-[68px] items-center">
                <Logo />

                <div className="flex justify-end items-center gap-5">
                  <NavLinks userRole={userRole} />
                  <UserIconMenu />
                  <button onClick={() => navigate("/help")}>
                    <QuestionMarkCircleIcon
                      height={"32px"}
                      className="text-white"
                    />
                  </button>
                  <MenuButton toggleNavbar={toggleNavbar} />
                </div>
              </div>
            </div>
          )}

          {/* </div> */}
        </div>
        <MobileMenu isOpen={isOpen} />
      </nav>
    </>
  );
};

export default Navbar;
