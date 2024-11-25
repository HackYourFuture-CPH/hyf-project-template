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
            setLoading(true);
            const userData = await makeRequest("/users/profile", {}, "GET");
            setCurrentUser(userData);
        } catch (error) {
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (inputs) => {
        try {
            setLoading(true);
            const userData = await makeRequest(`/auth/login`, inputs, "POST");
            setCurrentUser(userData);
            setLoading(false);
        } catch (error) {
            console.error("Login failed:", error.message);
            setLoading(false);
            throw error;
        }
    };

    // Logout function to clear user data and session
    const logout = async () => {
        try {
            setLoading(true);
            await makeRequest("/auth/logout", {}, "POST"); // No userData needed for logout
            setCurrentUser(null); // Clear the user state
            setLoading(false);
        } catch (error) {
            console.error("Logout failed:", error.message);
            setLoading(false);
        }
    };

    // Run once on component mount to check user's session
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
