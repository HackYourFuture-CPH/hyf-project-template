"use client";
import Image from "next/image";
import Navbar from "../Nav/Navbar";
import styles from "./Header.module.css";
import logo from "../../assets/Logo.svg";
import Link from "next/link";
import BurgerIcon from "./BurgerIcon";
import BurgerMenu from "./BurgerMenu";
import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.warn("Error checking auth status:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (e.g., when user logs out in another tab)
    window.addEventListener("storage", checkAuthStatus);
    
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // close menu on Escape for keyboard users
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <div>
          <Link href="/" className={styles.logoDiv}>
            <Image
              className={styles.logo}
              src={logo}
              alt="logo"
              width={120}
              height={60}
              priority
            />
          </Link>
        </div>
        <div className={styles.desktopNav}>
          <Navbar />
          {!isLoggedIn ? (
            <Link href="/login" className={styles.login} aria-label="Login">
              <span>Login</span>
            </Link>
          ) : (
            <div className={styles.userMenu}>
              <span className={styles.welcomeText}>
                Welcome, {user?.first_name || "User"}!
              </span>
              <div className={styles.userActions}>
                {user?.role === "admin" ? (
                  <Link href="/admin" className={styles.dashboardLink} aria-label="Admin Dashboard">
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link href="/user" className={styles.dashboardLink} aria-label="User Dashboard">
                    <span>My Dashboard</span>
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.mobileNav}>
          <div className={styles.burgerRight}>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={styles.burgerButton}
              onClick={toggleMenu}
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
          <BurgerMenu open={menuOpen}>
            <Navbar />
            {!isLoggedIn ? (
              <Link href="/login" className={styles.login}>
                <span>Login</span>
              </Link>
            ) : (
              <div className={styles.mobileUserMenu}>
                <div className={styles.mobileWelcome}>
                  <span>Welcome, {user?.first_name || "User"}!</span>
                </div>
                {user?.role === "admin" ? (
                  <Link href="/admin" className={styles.mobileDashboardLink}>
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link href="/user" className={styles.mobileDashboardLink}>
                    <span>My Dashboard</span>
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </BurgerMenu>
        </div>
      </div>
    </header>
  );
}
