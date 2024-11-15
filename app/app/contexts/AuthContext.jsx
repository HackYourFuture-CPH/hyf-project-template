"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await makeRequest("/users/profile/self", {}, "GET");
        setCurrentUser(data);
      } catch (error) {
        console.error("Not logged in:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const login = (userData) => setCurrentUser(userData);
  const logout = () => setCurrentUser(null);
  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
