// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

// const NavLinks = ({ userRole }) => {
//   const location = useLocation();

//   // Check the userRole directly inside the component
//   const isEmployee = userRole === "employee";

//   return (
//     <div className="hidden md:block">
//       <div className="ml-10 flex items-baseline space-x-4">
//         <NavLink
//           to="/home"
//           className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
//             location.pathname === "/home" ? "bg-gray-700 text-white" : ""
//           }`}
//         >
//           My Tickets
//         </NavLink>

//         {/* Always show Raised Tickets for non-employees */}
//         {!isEmployee && (
//           <NavLink
//             to="/raisedtickets"
//             className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
//               location.pathname === "/raisedtickets"
//                 ? "bg-gray-700 text-white"
//                 : ""
//             }`}
//           >
//             Raised Tickets
//           </NavLink>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavLinks;

// -----------CURRENT WORKING CODE OF NAVLINK-------------
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MyRoutes, UserRole } from "../../common/common.config";

const NavLinks = ({ userRole }) => {
  const location = useLocation();
  console.log("location---", location.pathname);
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <NavLink
          to={MyRoutes.MY_TICKETS}
          // className={`text-gray-700 hover:bg-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
          className={`text-white hover:bg-white hover:text-jtBlue px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === MyRoutes.MY_TICKETS
              ? "text-red-900 bg-white"
              : ""
          }`}
        >
          My Tickets
        </NavLink>
        {!(userRole === UserRole.EMPLOYEE) && (
          <NavLink
            to={MyRoutes.RAISED_TICKETS}
            className={`text-white hover:bg-white hover:text-jtBlue px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === MyRoutes.RAISED_TICKETS
                ? "text-green-900 bg-white"
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
