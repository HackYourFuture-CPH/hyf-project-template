"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./addBook.module.css";

const addBook = ({ category }) => {
    const [query, setQuery] = useState(""); // Search query
    const [searchResults, setSearchResults] = useState([]); // Store search results
    const [loading, setLoading] = useState(false); // Loading state for API request
    const [error, setError] = useState(null); // Error state
    const [addedBooks, setAddedBooks] = useState([]); // Track added books

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    // Function to add a book to the bookshelf based on category
    const addBook = (book) => {
        // Example logic for adding the book to the appropriate category
        setAddedBooks((prev) => [...prev, { ...book, category }]); // Track added books by category
        console.log(`Book added to ${category}:`, book);
    };

    // Fetch search results from the API when query changes
    useEffect(() => {
        if (query) {
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(
                        "http://localhost:3001/api/searchGoogleBooks",
                        {
                            params: {
                                query: query,
                                page: 1,
                                pageSize: 10,
                            },
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
            <h2>
                Add a Book to Your{" "}
                {category === "read"
                    ? "'Read' Shelf"
                    : category === "currentlyReading"
                      ? "'Currently Reading' Shelf"
                      : "'Wish to Read' Shelf"}
            </h2>
            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for a book..."
                className={styles.searchInput}
            />
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {query && !loading && !error && (
                <div className={styles.resultsContainer}>
                    {searchResults.length > 0 ? (
                        <ul className={styles.resultsList}>
                            {searchResults.map((result, idx) => (
                                <li key={idx} className={styles.resultItem}>
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
                                        onClick={() => addBook(result)}
                                        className={styles.addButton}
                                        disabled={addedBooks.some(
                                            (book) =>
                                                book.id === result.id && book.category === category
                                        )}
                                    >
                                        {addedBooks.some(
                                            (book) =>
                                                book.id === result.id && book.category === category
                                        )
                                            ? "Added"
                                            : "Add"}
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

export default addBook;
