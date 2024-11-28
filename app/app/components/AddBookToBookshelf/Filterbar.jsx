import { filterOptions } from "./constants";

const Filter = ({ filter, setFilter }) => {
  return (
    <div className="filter">
      <label htmlFor="filter">Filter:</label>
      <select
        name="filter"
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
