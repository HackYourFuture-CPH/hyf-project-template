"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();

  // Conditional greeting message: Show username if logged in, or 'Guest' if not
  const userName = useMemo(
    () => currentUser?.firstName || "Guest",
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

  return (
    <header className={styles.header}>
      {/* Left Section: Greeting (only show when logged in) */}
      <div className={styles.leftNav}>
        {/* Only display greeting if currentUser exists */}
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
          {/* Log out link */}
          {currentUser ? (
            <li className={styles.navItem}>
              <Link href="/login">LOG OUT</Link>
            </li>
          ) : (
            <li className={styles.navItem}>
              <Link href="/login">LOG IN</Link>
            </li>
          )}
        </ul>

        {/* Search bar */}
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
