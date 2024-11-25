"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import styles from "./Header.module.css";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, logout } = useAuth(); // Use currentUser and logout from AuthContext

  // Conditional greeting message: Show username if logged in, or 'Guest' if not
  const userName = useMemo(
    () => currentUser?.user.firstName || "Guest",
    [currentUser]
  );

  // For debugging purposes
  console.log(`currentUser: ${JSON.stringify(currentUser, null, 2)}`);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search on "Enter" key press
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      router.push("/login"); // Redirect to the login page after logging out
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className={styles.header}>
      {/* Left Section: Greeting */}
      <div className={styles.leftNav}>
        {currentUser && <p className={styles.greeting}>Hello, {userName}!</p>}
      </div>

      {/* Center Section: Logo */}
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

      {/* Right Section: Links and Search */}
      <div className={styles.rightNav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/dashboard">DASHBOARD</Link>
          </li>
          {currentUser ? (
            <li className={styles.navItem}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                LOG OUT
              </button>
            </li>
          ) : (
            <li className={styles.navItem}>
              <Link href="/login">LOG IN</Link>
            </li>
          )}
        </ul>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyPress}
        />
      </div>
    </header>
  );
};

export default Header;
