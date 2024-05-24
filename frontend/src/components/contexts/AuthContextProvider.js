// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? { token } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("accessToken", user.token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [user]);

  const login = (token) => {
    setUser({ token });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
