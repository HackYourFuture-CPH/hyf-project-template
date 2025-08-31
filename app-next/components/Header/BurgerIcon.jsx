import React from "react";
import styles from "./BurgerIcon.module.css";
import { FaBars } from "react-icons/fa";
export default function BurgerIcon({ open, onClick }) {
  return (
    <button
      className={open ? `${styles.burger} ${styles.open}` : styles.burger}
      onClick={onClick}
      aria-label="Toggle navigation"
    >
      <FaBars size={32} color="#38bdf8" />
    </button>
  );
}
