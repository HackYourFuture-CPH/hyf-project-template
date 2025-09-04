"use client";
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
                to="home"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
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
                spy={true}
              >
                Tours
              </Link>
            </li>
            <li>
              <Link
                to="blogposts"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Blog Posts
              </Link>
            </li>

            <li>
              <Link
                to="attractions"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Attractions
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
