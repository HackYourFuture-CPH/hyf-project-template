import React from "react";
import Image from "next/image";
import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Image
                    src="/logo.png"
                    alt="Leaf Notes Logo"
                    className={styles.logo}
                    width={150}
                    height={50}
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
