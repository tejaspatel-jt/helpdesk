import React from "react";
import { Link } from "react-router-dom";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";

const Sidebar = () => {
  return (
    <nav className="bg-zinc-600 w-32 p-4 flex flex-col">
      {/* Brand or logo */}
      <div className="text-white text-xl font-bold mb-8 pl-4">Home</div>

      {/* Navigation links */}
      <Link
        to="/profile"
        className="text-white flex flex-col items-center mb-4 hover:underline"
      >
        <UserIcon className="w-6 h-6" />
        <span className="mt-1">My Profile</span>
      </Link>
      <Link
        to="/tickets"
        className="text-white flex flex-col items-center hover:underline"
      >
        <TicketIcon className="w-6 h-6" />
        <span className="mt-1">My Tickets</span>
      </Link>
    </nav>
  );
};

export default Sidebar;
