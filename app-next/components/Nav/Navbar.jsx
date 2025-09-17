"use client";
import { Link as ScrollLink } from "react-scroll";
import NextLink from "next/link";
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
              <ScrollLink
                to="home"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Home
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="trips"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Tours
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="blogposts"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Blog Posts
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="attractions"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Attractions
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="planner"
                smooth={true}
                duration={600}
                offset={-70}
                activeClass={styles.active}
                className={styles.link}
                spy={true}
              >
                Trip Planner
              </ScrollLink>
            </li>
          </ul>
        </nav>
      )}
      {!isHome && (
        <nav className={styles.nav}>
          <ul>
            <li>
              <NextLink href="/" className={styles.link}>
                Home
              </NextLink>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
