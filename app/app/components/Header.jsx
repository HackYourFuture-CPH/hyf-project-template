"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Placeholder for user name. Replace this with actual user data (e.g., from context or state).
const userName = "John Doe"; // Replace this with actual user name from context or API

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      {/* Left Section: Greeting */}
      <div className={styles.leftNav}>
        <p className={styles.greeting}>Hello, {userName}!</p>
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
          <li className={styles.navItem}>
            <Link href="/login">LOG OUT</Link>
          </li>
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
