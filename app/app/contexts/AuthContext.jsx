"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { makeRequest } from "../utils/makeRequest";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if the user is authenticated when the app loads (for page refresh)
  const refreshUser = async () => {
    try {
      const userData = await makeRequest(
        "http://localhost:3001/users/profile",
        {},
        "GET"
      );
      setCurrentUser(userData); // Set the currentUser with the response
    } catch (error) {
      setCurrentUser(null); // If authentication fails, no user is logged in
    } finally {
      setLoading(false); // Once check is done, stop loading
    }
  };

  const login = async (inputs) => {
    try {
      setLoading(true);
      const userData = await makeRequest(
        "http://localhost:3001/auth/login",
        inputs,
        "POST"
      );
      setCurrentUser(userData);
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error.message);
      setLoading(false);
      throw error;
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      await makeRequest("http://localhost:3001/auth/logout", {}, "POST");
      setCurrentUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
      setLoading(false);
    }
  };
  // Check the user's authentication status when the component mounts (or page refreshes)
  useEffect(() => {
    refreshUser(); // Call to check if the user is still logged in
  }, []); // Empty dependency array means it runs once after component mounts

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
