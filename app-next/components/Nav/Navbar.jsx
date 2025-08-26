"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link
            href="/"
            className={path === "/" ? styles.active : styles.link}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/destination"
            className={path === "/destination" ? styles.active : styles.link}
          >
            Destination
          </Link>
        </li>

        <li>
          <Link
            href="/trips"
            className={path === "/trips" ? styles.active : styles.link}
          >
            Trips
          </Link>
        </li>

        <li>
          <Link
            href="/community"
            className={path === "/community" ? styles.active : styles.link}
          >
            Community
          </Link>
        </li>
      </ul>
    </nav>
  );
}
