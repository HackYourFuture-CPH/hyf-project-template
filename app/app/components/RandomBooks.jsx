"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./RandomBooks.module.css"; // Import the updated CSS for styling

const RandomBooks = () => {
    const [books, setBooks] = useState([]); // Store the books
    const [loading, setLoading] = useState(true); // Loading state for API request
    const [error, setError] = useState(""); // Store any potential errors

    useEffect(() => {
        // Fetching random books from Google Books API
        axios
            .get("https://www.googleapis.com/books/v1/volumes?q=book&maxResults=30")
            .then((response) => {
                // Set the books from the API response
                setBooks(response.data.items || []);
                setLoading(false); // Data is fetched, stop loading
            })
            .catch((err) => {
                setError("Error fetching books"); // Set error message in case of failure
                setLoading(false); // Stop loading on error
                console.error(err);
            });
    }, []); // Empty dependency array means this will run once when the component mounts

    if (loading) return <p>Loading books...</p>; // Display loading message while fetching data

    if (error) return <p>{error}</p>; // Display error message if there’s an issue fetching data

    return (
        <div className={styles.popularBooks}>
            {/* Header */}
            <h2 className={styles.title}>Popular Books of the Week</h2>

            <div className={styles.booksContainer}>
                {/* Map through books and display image */}
                {books.map((book, index) => (
                    <div key={index} className={styles.bookCard}>
                        {/* Add a link around the book image */}
                        <a
                            href={book.volumeInfo.infoLink} // Use the infoLink from Google Books API
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.bookLink}
                        >
                            <img
                                src={book.volumeInfo.imageLinks?.thumbnail}
                                alt={book.volumeInfo.title}
                                title={book.volumeInfo.subtitle}
                                className={styles.bookImage}
                            />
                        </a>
                        {/* Book title displayed under the image */}
                        <h3 className={styles.bookTitle}>{book.volumeInfo.title.slice(0, 40)}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RandomBooks;
