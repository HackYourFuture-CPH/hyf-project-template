import { filterOptions } from "./constants";

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="filter">
      <label htmlFor="language">Language:</label>
      <select
        name="language"
        id="language"
        value={filters.language}
        onChange={(e) => onFilterChange("language", e.target.value)}
      >
        {filterOptions.languages.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="genre">Genre:</label>
      <select
        name="genre"
        id="genre"
        value={filters.genre}
        onChange={(e) => onFilterChange("genre", e.target.value)}
      >
        {filterOptions.genres.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="filterType">Book Type:</label>
      <select
        name="filterType"
        id="filterType"
        value={filters.filterType}
        onChange={(e) => onFilterChange("filterType", e.target.value)}
      >
        {filterOptions.filterTypes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="maxResults">Show:</label>
      <select
        name="maxResults"
        id="maxResults"
        value={filters.maxResults}
        onChange={(e) => onFilterChange("maxResults", Number(e.target.value))}
      >
        {filterOptions.maxResults.map((option) => (
          <option key={value} value={value}>
            {value} results
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
