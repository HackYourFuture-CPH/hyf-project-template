"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
//import jwt_decode from "jwt-decode"; // Use default import for jwt-decode

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState(""); // State to store the username
  const router = useRouter();

  // Retrieve the token from cookies and decode it
  useEffect(() => {
    const token = Cookies.get("token"); // Get token from cookies
    console.log("Token from cookies:", token); // Log the token

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        console.log("Decoded token:", decodedToken); // Log the decoded token

        if (decodedToken.username) {
          setUserName(decodedToken.username); // Set the username if it exists
        } else {
          setUserName("Guest"); // Fallback if no username in token
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("Guest"); // Fallback if there's an error decoding the token
      }
    } else {
      setUserName("Guest"); // Fallback if no token is found
    }
  }, []); // Empty dependency array means this runs once when the component mounts

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
