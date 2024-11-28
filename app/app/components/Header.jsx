"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
        {!currentUser ? (
          <>
            {pathname !== "/login" && (
              <Link href="/login" className={styles.navButton}>
                LOG IN
              </Link>
            )}
            {pathname !== "/signup" && (
              <Link href="/signup" className={styles.navButton}>
                SIGN UP
              </Link>
            )}
          </>
        ) : (
          <>
            {pathname !== "/dashboard" && (
              <Link href="/dashboard" className={styles.navButton}>
                DASHBOARD
              </Link>
            )}
            <button onClick={handleLogout} className={styles.navButton}>
              LOG OUT
            </button>
          </>
        )}
        {/* <ThemeToggle /> */}
      </nav>
    </header>
  );
};

export default Header;
