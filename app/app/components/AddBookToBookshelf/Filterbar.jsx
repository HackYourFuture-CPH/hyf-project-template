import { filterOptions } from "./constants";
import styles from "./FilterBar.module.css";

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className={styles.filterBar}>
      <h3 className={styles.filterTitle}>Filters</h3>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Language</label>
        <select
          value={filters.language}
          onChange={(e) => onFilterChange("language", e.target.value)}
          className={styles.filterSelect}
        >
          {filterOptions.languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Genre</label>
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange("genre", e.target.value)}
          className={styles.filterSelect}
        >
          {filterOptions.genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Print Type</label>
        <select
          value={filters.printType}
          onChange={(e) => onFilterChange("printType", e.target.value)}
          className={styles.filterSelect}
        >
          {filterOptions.printTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Results Per Page</label>
        <select
          value={filters.maxResults}
          onChange={(e) => onFilterChange("maxResults", Number(e.target.value))}
          className={styles.filterSelect}
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
