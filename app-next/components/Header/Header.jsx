"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png"
            alt="CareConnect Logo"
            width={40}
            height={40}
          />
          <span>CareConnect</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/request-help">Request Help</Link>
          </li>
          <li>
            <Link href="/offer-help">Offer Help</Link>
          </li>
          <li>
            <Link href="/About">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/Services">Services</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
