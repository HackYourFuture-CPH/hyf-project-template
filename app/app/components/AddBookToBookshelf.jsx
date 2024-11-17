"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddBookToBookshelf.module.css";
const AddBookToBookshelf = ({ category, onBookAdded }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };
  const mapCategoryToStatus = (category) => {
    // Map category to backend-compatible status
    const statusMap = {
      read: "READ",
      currentlyReading: "CURRENTLY READING",
      wishToRead: "WISH TO READ",
    };
    return statusMap[category] || "READ"; // Default to "READ" if category is unknown
  };
  const handleAddBook = async (book) => {
    try {
      const status = mapCategoryToStatus(category);
      await axios.post(
        "http://localhost:3001/api/user-books/add",
        {
          google_books_id: book.google_book_id,
          title: book.title,
          author: book.authors,
          genre: book.genre,
          cover_image: book.cover_image,
          description: book.description,
          status,
        },
        { withCredentials: true }
      );
      alert(`${book.title} added to your ${category} bookshelf.`);
      onBookAdded(); // Notify parent to refresh bookshelf
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };
  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            "http://localhost:3001/api/searchGoogleBooks",
            {
              params: { query, page: 1, pageSize: 10 },
            }
          );
          setSearchResults(response.data || []);
        } catch (err) {
          setError("An error occurred while fetching the search results.");
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [query]);
  return (
    <div className={styles.addBookContainer}>
      <h2>Add Book to {category.replace(/([a-z])([A-Z])/g, "$1 $2")}</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search for a book..."
        className={styles.searchInput}
      />
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && query && (
        <div className={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <ul className={styles.resultsList}>
              {searchResults.map((result) => (
                <li key={result.google_book_id} className={styles.resultItem}>
                  {result.cover_image && (
                    <img
                      src={result.cover_image}
                      alt={result.title}
                      className={styles.bookImage}
                    />
                  )}
                  <div className={styles.bookDetails}>
                    <h4>{result.title}</h4>
                    <p>{result.authors || "Unknown Author"}</p>
                  </div>
                  <button
                    onClick={() => handleAddBook(result)}
                    className={styles.addButton}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};
export default AddBookToBookshelf;
