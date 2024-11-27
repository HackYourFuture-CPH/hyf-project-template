"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest";

const AuthContext = createContext({
  currentUser: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user is authenticated when the app loads (for page refresh)
  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await makeRequest("/users/profile", {}, "GET");
      setCurrentUser(userData);
    } catch (error) {
      setCurrentUser(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (inputs) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await makeRequest(`/auth/login`, inputs, "POST");
      setCurrentUser(userData);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function to clear user data and session
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await makeRequest("/auth/logout", {}, "POST"); // No userData needed for logout
      setCurrentUser(null); // Clear the user state
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Run once on component mount to check user's session
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
