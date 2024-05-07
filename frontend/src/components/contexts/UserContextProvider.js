import React, { createContext, useState } from "react";
import { UserDetails } from "../CustomObjects/UserDetails";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const userDetail = new UserDetails("");
  const [userDetails, setUserDetails] = useState(userDetail);
  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}
