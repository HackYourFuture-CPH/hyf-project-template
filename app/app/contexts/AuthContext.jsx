"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { makeRequest } from "../utils/makeRequest";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    console.log({ parsedUser });
    setCurrentUser(parsedUser);
    return parsedUser;
  };

  const saveUserToLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUserToLocalStorage = () => {
    localStorage.removeItem("user");
  };

  useEffect(() => {
    refreshUserFromLocalStorage();
  }, []);

  const login = async (inputs) => {
    try {
      setLoading(true);
      const userData = await makeRequest(
        "http://localhost:3001/auth/login",
        inputs,
        "POST"
      );
      setLoading(false);
      saveUserToLocalStorage(userData);

      setCurrentUser(userData);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await makeRequest("http://localhost:3001/auth/logout", {}, "POST");

      clearUserToLocalStorage();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
