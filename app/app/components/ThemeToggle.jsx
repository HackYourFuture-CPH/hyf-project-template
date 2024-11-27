import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
