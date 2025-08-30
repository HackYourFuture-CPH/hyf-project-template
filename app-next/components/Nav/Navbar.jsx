"use client";
//import Link from "next/link";
import { Link } from "react-scroll";

import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const isHome = path === "/";

  return (
    <>
      {isHome && (
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
                to="trips"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
              >
                Trips
              </Link>
            </li>
            <li>
              <Link
                to="destination"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
              >
                Destination
              </Link>
            </li>

            <li>
              <Link
                to="community"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
              >
                Community
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
