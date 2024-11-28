import { useState } from "react";
import { FilterBar } from "./FilterBar";
import { BookGrid } from "./BookGrid";
import { defaultFilters, formatSearchQuery } from "./constants";

const SearchForm = ({ onAddBook }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const handleSearch = () => {
    const searchQuery = formatSearchQuery(filters);
    onSearch(searchQuery);
  };

  return (
    <div className="search-form">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};
