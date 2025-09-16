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
          // removed `priority` to avoid Next.js preloading this SVG
          // which can cause a browser warning if it's not used immediately
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
              <div className={styles.userAvatar}>
                {user?.profile_image ? (
                  <Image
                    src={user.profile_image}
                    alt={`${user?.first_name || "User"} profile`}
                    width={32}
                    height={32}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {(user?.first_name || user?.username || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.userActions}>
                <Link href={user?.role === "admin" ? "/admin" : "/user"} className={styles.dashboardLink} aria-label={user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}>
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
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
                <div className={styles.mobileUserAvatar}>
                  {user?.profile_image ? (
                    <Image
                      src={user.profile_image}
                      alt={`${user?.first_name || "User"} profile`}
                      width={40}
                      height={40}
                      className={styles.mobileAvatarImage}
                    />
                  ) : (
                    <div className={styles.mobileAvatarPlaceholder}>
                      {(user?.first_name || user?.username || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <Link href={user?.role === "admin" ? "/admin" : "/user"} className={styles.mobileDashboardLink}>
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            )}
          </BurgerMenu>
        </div>
      </div>
    </header>
  );
}
