"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await makeRequest(
          "http://localhost:3001/users/profile/self",
          {},
          "GET"
        );
        setCurrentUser(data);
      } catch (error) {
        console.error("Not logged in:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (!currentUser) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const login = async (inputs) => {
    try {
      const userData = await makeRequest(
        "http://localhost:3001/auth/login",
        inputs,
        "POST"
      );
      setCurrentUser(userData);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await makeRequest("http://localhost:3001/auth/logout", {}, "POST");
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
