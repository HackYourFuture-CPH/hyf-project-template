import React from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";

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
                        <Link href="/about">ABOUT</Link> {/* Using Link for navigation */}
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/search">SEARCH</Link> {/* Using Link for navigation */}
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/profile">PROFILE</Link> {/* Using Link for navigation */}
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/signin">SIGN IN</Link> {/* Using Link for navigation */}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
