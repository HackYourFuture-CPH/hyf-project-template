import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import FilterBar from "./Filterbar";
import BookGrid from "./BookGrid";
import { defaultFilters, formatSearchQuery } from "./constants";
import styles from "./SearchForm.module.css";

const SearchForm = ({ onAddBook }) => {
  const [searchParams, setSearchParams] = useState({ title: "", author: "" });
  const [filters, setFilters] = useState(defaultFilters);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(
    debounce(async (searchTerms, filterOptions) => {
      if (!searchTerms.title && !searchTerms.author) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchGoogleBooks`,
          {
            params: {
              title: searchTerms.title || undefined,
              author: searchTerms.author || undefined,
              genre: filterOptions.genre !== "all" ? filters.genre : undefined,
              language: filterOptions.language,
              filterType: filterOptions.filterType,
              printType: filterOptions.printType,
              orderBy: filterOptions.orderBy,
              page: 1,
              pageSize: filterOptions.maxResults,
            },
          }
        );
        setBooks(response.data || []);
      } catch (err) {
        setError("An error occurred while fetching the search results.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchParams.title || searchParams.author) {
      debouncedSearch(searchParams, filters);
    }
  }, [searchParams, filters, debouncedSearch]);

  const handleInputChange = (e, field) => {
    const newSearchParams = {
      ...searchParams,
      [field]: e.target.value,
    };
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputs}>
        <input
          type="text"
          value={searchParams.title}
          onChange={(e) => handleInputChange(e, "title")}
          placeholder="Enter book title"
          className={styles.searchInput}
        />
        <input
          type="text"
          value={searchParams.author}
          onChange={(e) => handleInputChange(e, "author")}
          placeholder="Enter author name"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.filterSection}>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className={styles.resultsSection}>
          {loading && <div className={styles.loading}>Searching...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && (
            <BookGrid books={books} onAddBook={onAddBook} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
