import React, { createContext, useState, useEffect } from "react";
import { UserDetails } from "../CustomObjects/UserDetails";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  // Retrieve user details from localStorage on initial load
  const storedUserData = localStorage.getItem("userData");
  const initialUserDetails = storedUserData ? JSON.parse(storedUserData) : {};

  const [userDetails, setUserDetails] = useState(initialUserDetails);

  // Update localStorage when userDetails change
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userDetails));
  }, [userDetails]);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

// -----CURRENT WORKING CODE OF CONTEXT PROVIDER---
// import React, { createContext, useState, useEffect } from "react";
// import { UserDetails } from "../CustomObjects/UserDetails";

// export const UserContext = createContext();

// export function UserContextProvider({ children }) {
//   // Retrieve user details from localStorage on initial load
//   const storedUserRole = localStorage.getItem("userRole");
//   const initialUserDetails = new UserDetails(storedUserRole);
//   const [userDetails, setUserDetails] = useState(initialUserDetails);

//   // Update localStorage when userDetails.role changes
//   useEffect(() => {
//     localStorage.setItem("userRole", userDetails.role);
//   }, [userDetails]);

//   return (
//     <UserContext.Provider value={{ userDetails, setUserDetails }}>
//       {children}
//     </UserContext.Provider>
//   );
// }
