"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext
import { useTheme } from "../contexts/ThemeContext"; // Import the ThemeContext
import styles from "./Header.module.css";

const Header = () => {
  const { currentUser, logout } = useAuth(); // Access user and logout function
  const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme function
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleLogout = async () => {
    await logout(); // Call the logout function
    router.push("/"); // Redirect to the home page
  };

  // Dynamically render buttons based on login status and current path
  const renderButtons = () => {
    if (!currentUser) {
      // User is not logged in
      if (pathname === "/login" || pathname === "/signup") {
        return (
          <button onClick={toggleTheme} className={styles.themeButton}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        );
      }
      return (
        <>
          <Link href="/login" className={styles.navButton}>
            LOG IN
          </Link>
          <Link href="/signup" className={styles.navButton}>
            SIGN UP
          </Link>
          <button onClick={toggleTheme} className={styles.themeButton}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </>
      );
    } else {
      // User is logged in
      if (pathname === "/dashboard") {
        return (
          <>
            <button className={styles.navButton} onClick={handleLogout}>
              LOG OUT
            </button>
            <button onClick={toggleTheme} className={styles.themeButton}>
              {theme === "light" ? "☀️" : "🌙"}
            </button>
          </>
        );
      }
      return (
        <>
          <Link href="/dashboard" className={styles.navButton}>
            DASHBOARD
          </Link>
          <button onClick={toggleTheme} className={styles.themeButton}>
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </>
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Leaf Notes Logo"
            className={styles.logo}
            width={150}
            height={50}
          />
        </Link>
      </div>
      <nav className={styles.nav}>{renderButtons()}</nav>
    </header>
  );
};

export default Header;
