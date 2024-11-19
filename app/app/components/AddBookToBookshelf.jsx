"use client";
import { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import styles from "./AddBookToBookshelf.module.css";

const isBookInCategory = (book, bookShelf) => {
  return (
    bookShelf.read.some((b) => b.google_books_id === book.google_book_id) ||
    bookShelf.currentlyReading.some(
      (b) => b.google_books_id === book.google_book_id
    ) ||
    bookShelf.wishToRead.some((b) => b.google_books_id === book.google_book_id)
  );
};

const AddBookToBookshelf = ({ category, onBookAdded, bookShelf }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Debounced search function
  const debouncedFetchSearchResults = debounce(
    async (query, setLoading, setError, setSearchResults) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchGoogleBooks`,
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
    },
    500
  ); // Delay the call by 500ms after the user stops typing

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    debouncedFetchSearchResults(
      e.target.value,
      setLoading,
      setError,
      setSearchResults
    );
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
    if (isBookInCategory(book, bookShelf)) {
      setError("This book is already in your library with the same status.");
      return;
    }

    try {
      const status = mapCategoryToStatus(category);
      setSuccessMessage(null);
      setError(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/add`,
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
      // Handle success
      if (response.status === 201) {
        setSuccessMessage(`${book.title} added to your ${category} bookshelf.`);
        onBookAdded(book); // Notify parent to refresh bookshelf
      }
    } catch (err) {
      // Handle error (e.g., book already exists)
      if (err.response?.status === 400) {
        setError("This book is already in your library with the same status.");
      } else {
        setError("An error occurred while adding the book.");
      }
      console.error("Error adding book:", err);
    }
  };

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
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {!loading && !error && query && (
        <div className={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <ul className={styles.resultsList}>
              {searchResults.map((result, index) => (
                <li
                  key={`${result.google_book_id}-${index}`}
                  className={styles.resultItem}
                >
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
