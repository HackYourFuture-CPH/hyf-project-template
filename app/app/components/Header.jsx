"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const router = useRouter(); // Use the router to navigate programmatically

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the search query
    };

    // Handle pressing Enter to trigger search
    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); // Navigate to the search page with query
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
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link href="/profile">PROFILE</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/signin">SIGN IN</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/signup">SIGN UP</Link>
                    </li>
                    <li className={styles.navItem}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyPress}
                        />
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
