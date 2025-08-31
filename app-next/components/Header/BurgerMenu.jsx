import React from "react";
import styles from "./BurgerMenu.module.css";

export default function BurgerMenu({ open, children }) {
  return (
    <div className={open ? styles.menuOpen : styles.menuClosed}>
      {children}
    </div>
  );
}
