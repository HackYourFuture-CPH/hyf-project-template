// app/components/Header.jsx
import React from "react";
import Image from "next/image"; // Import the Image component from next/image
import styles from "./Header.module.css"; // Import the CSS module

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Image
                    src="/logo.png" // Path to your logo in the public folder
                    alt="Leaf Notes Logo"
                    className={styles.logo}
                    width={150} // Set the desired width
                    height={50} // Set the desired height
                />
            </div>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <a href="/about">ABOUT</a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="/search">SEARCH</a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="/contact">CONTACT</a>
                    </li>
                    <li className={styles.navItem}>
                        <a href="/signin">SIGN IN</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
