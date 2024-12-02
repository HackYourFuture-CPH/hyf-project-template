"use client";

import { filterOptions } from "./constants";
import styles from "./FilterBar.module.css";
import { useTheme } from "../../contexts/ThemeContext";

const FilterBar = ({ filters, onFilterChange }) => {
  const { theme } = useTheme(); // Access theme context
  const isDarkMode = theme === "dark"; // Check if dark mode is enabled

  return (
    <div className={`${styles.filterBar} ${isDarkMode ? styles.darkMode : ""}`}>
      {/* <h3
        className={`${styles.filterTitle} ${isDarkMode ? styles.darkMode : ""}`}
      >
        Filters
      </h3> */}

      <div
        className={`${styles.filterGroup} ${isDarkMode ? styles.darkMode : ""}`}
      >
        <label
          className={`${styles.filterLabel} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => onFilterChange("language", e.target.value)}
          className={`${styles.filterSelect} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          {filterOptions.languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`${styles.filterGroup} ${isDarkMode ? styles.darkMode : ""}`}
      >
        <label
          className={`${styles.filterLabel} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          Genre
        </label>
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange("genre", e.target.value)}
          className={`${styles.filterSelect} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          {filterOptions.genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`${styles.filterGroup} ${isDarkMode ? styles.darkMode : ""}`}
      >
        <label
          className={`${styles.filterLabel} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          Print Type
        </label>
        <select
          value={filters.printType}
          onChange={(e) => onFilterChange("printType", e.target.value)}
          className={`${styles.filterSelect} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          {filterOptions.printTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`${styles.filterGroup} ${isDarkMode ? styles.darkMode : ""}`}
      >
        <label
          className={`${styles.filterLabel} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          Results Per Page
        </label>
        <select
          value={filters.maxResults}
          onChange={(e) => onFilterChange("maxResults", Number(e.target.value))}
          className={`${styles.filterSelect} ${
            isDarkMode ? styles.darkMode : ""
          }`}
        >
          {filterOptions.maxResults.map((num) => (
            <option key={num} value={num}>
              {num} results
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
