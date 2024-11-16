"use client";

import React, { useState, useEffect } from "react";
import styles from "./Bookshelf.module.css";
import Button from "../components/Button";
import AddBookToBookshelf from "./AddBookToBookshelf"; // Import the AddBook component
import axios from "axios";

const Bookshelf = ({ userId }) => {
    const [bookShelf, setBookShelf] = useState({
        read: [],
        currentlyReading: [],
        wishToRead: [],
    });
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const [currentCategory, setCurrentCategory] = useState(""); // Track the category being added to
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return; // Ensure userId is available before making the API call

        // Fetch books from the API
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/user-books/list`, {
                    withCredentials: true, // Send cookies for authentication if needed
                });

                // Group books by their status
                const books = response.data.reduce(
                    (acc, book) => {
                        if (book.status === "READ") acc.read.push(book);
                        if (book.status === "CURRENTLY READING") acc.currentlyReading.push(book);
                        if (book.status === "WISH TO READ") acc.wishToRead.push(book);
                        return acc;
                    },
                    { read: [], currentlyReading: [], wishToRead: [] }
                );

                setBookShelf(books);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookshelf data:", err);
                setError("Error fetching bookshelf data.");
                setLoading(false);
            }
        };

        fetchBooks();
    }, [userId]); // Re-fetch if userId changes

    const handleAddBookClick = (category) => {
        setCurrentCategory(category); // Set the category
        setModalOpen(true); // Open the modal
    };

    const closeModal = () => setModalOpen(false); // Close the modal

    if (loading) return <p>Loading bookshelf...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.bookshelf}>
            <div className={styles.bookshelfHeader}>
                <h3>Bookshelf</h3>
            </div>

            <div className={styles.bookshelfSection}>
                <p>Read:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.read.map((book) => (
                        <img
                            key={book.book_id}
                            src={book.cover_image}
                            alt={book.title}
                            className={styles.bookImage}
                        />
                    ))}

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("read")}
                    >
                        ADD BOOK
                    </Button>
                </div>
            </div>

            <div className={styles.bookshelfSection}>
                <p>Currently Reading:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.currentlyReading.map((book) => (
                        <img
                            key={book.book_id}
                            src={book.cover_image}
                            alt={book.title}
                            className={styles.bookImage}
                        />
                    ))}

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("currentlyReading")}
                    >
                        ADD BOOK
                    </Button>
                </div>
            </div>

            <div className={styles.bookshelfSection}>
                <p>Wish to Read:</p>
                <div className={styles.bookshelfImages}>
                    {bookShelf.wishToRead.map((book) => (
                        <img
                            key={book.book_id}
                            src={book.cover_image}
                            alt={book.title}
                            className={styles.bookImage}
                        />
                    ))}

                    <Button
                        className={styles.addBookButton}
                        onClick={() => handleAddBookClick("wishToRead")}
                    >
                        ADD BOOK
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button onClick={closeModal} className={styles.closeButton}>
                            &times;
                        </button>
                        <AddBookToBookshelf category={currentCategory} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookshelf;
