import React from "react";
import styles from "./BurgerIcon.module.css";
import { FaBars } from "react-icons/fa";
export default function BurgerIcon({ open }) {
  // Render a non-button wrapper since the parent Header already renders
  // a <button> that handles click/keyboard events. This avoids nested
  // <button> elements which cause hydration and accessibility errors.
  return (
    <span
      className={open ? `${styles.burger} ${styles.open}` : styles.burger}
      aria-hidden="true"
    >
      <FaBars size={32} color="#38bdf8" />
    </span>
  );
}
