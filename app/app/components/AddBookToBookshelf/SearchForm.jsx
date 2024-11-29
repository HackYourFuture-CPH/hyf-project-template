import { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import FilterBar from "./FilterBar";
import BookGrid from "./BookGrid";
import { defaultFilters, formatSearchQuery } from "./constants";
import styles from "./SearchForm.module.css";

const SearchForm = ({ onAddBook }) => {
  const [searchParams, setSearchParams] = useState({ title: "", author: "" });
  const [filters, setFilters] = useState(defaultFilters);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedFetchSearchResults = debounce(
    async (title, author, filters) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchGoogleBooks`,
          {
            params: {
              title: title || undefined,
              author: author || undefined,
              genre: filters.genre !== "all" ? filters.genre : undefined,
              language: filters.language,
              filterType: filters.filterType,
              printType: filters.printType,
              orderBy: filters.orderBy,
              page: 1,
              pageSize: filters.maxResults,
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
    },
    500
  );

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedFetchSearchResults(
      searchParams.title,
      searchParams.author,
      filters
    );
  };

  return (
    <div className={styles.searchForm}>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={searchParams.title}
            onChange={(e) =>
              setSearchParams({ ...searchParams, title: e.target.value })
            }
            placeholder="Enter book title"
            className={styles.input}
          />
          <input
            type="text"
            value={searchParams.author}
            onChange={(e) =>
              setSearchParams({ ...searchParams, author: e.target.value })
            }
            placeholder="Enter author name"
            className={styles.input}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <BookGrid books={books} onAddBook={onAddBook} loading={loading} />
    </div>
  );
};

export default SearchForm;
