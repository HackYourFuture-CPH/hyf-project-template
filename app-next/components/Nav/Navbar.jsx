"use client";
import { Link as ScrollLink, scroller } from "react-scroll";
import NextLink from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();

  const isHome = path === "/";

  const items = [
    { id: "home", label: "Home" },
    { id: "trips", label: "Tours" },
    { id: "blogposts", label: "Blog Posts" },
    { id: "attractions", label: "Attractions" },
    { id: "planner", label: "Trip Planner" },
  ];

  const handleClick = (e, id) => {
    // allow default modifier-key behavior
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (isHome) {
      scroller.scrollTo(id, {
        duration: 600,
        smooth: true,
        offset: -70,
      });
    } else {
      // navigate to root with hash; once there the browser will land on the anchor
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {/* Always render an anchor-like element so right-click/open in new tab works */}
            <a
              href={`/#${item.id}`}
              className={styles.link}
              onClick={(e) => handleClick(e, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
