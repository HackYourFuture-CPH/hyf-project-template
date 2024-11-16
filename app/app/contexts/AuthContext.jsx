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
          `${NEXT_PUBLIC_APP_API_URL}/users/profile/self`,
          {},
          "GET"
        );
        setCurrentUser(data);
      } catch (error) {
        console.log("Not logged in:", error.message);
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
        `${NEXT_PUBLIC_APP_API_URL}/auth/login`,
        inputs,
        "POST"
      );
      setCurrentUser(userData);
    } catch (error) {
      console.log("Login failed:", error.message);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await makeRequest(`${NEXT_PUBLIC_APP_API_URL}/auth/logout`, {}, "POST");
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
