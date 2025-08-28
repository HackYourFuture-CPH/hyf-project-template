"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          PetPass
        </Link>

        {/* Desktop menu */}
        <div className={styles.menu}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        {/* Login button */}
        <div className={styles.authBtn}>
          <button> 🔒Login</button>
        </div>

        {/* Hamburger button */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={isOpen ? styles.barOpen : styles.bar}></span>
          <span className={isOpen ? styles.barOpen : styles.bar}></span>
          <span className={isOpen ? styles.barOpen : styles.bar}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <button className={styles.mobileAuthBtn}>Login</button>
        </div>
      )}
    </nav>
  );
}
