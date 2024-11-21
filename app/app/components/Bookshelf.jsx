"use client";

import React, { useState, useEffect } from "react";
import styles from "./Bookshelf.module.css";
import Button from "../components/Button";
import AddBookToBookshelf from "./AddBookToBookshelf";
import FavoriteQuote from "./FavoriteQuote";
import axios from "axios";

const Bookshelf = ({ userId, updateBooksReadCount }) => {
    const [bookShelf, setBookShelf] = useState({
        read: [],
        currentlyReading: [],
        wishToRead: [],
    });
    const [isModalOpen, setModalOpen] = useState(false);
    const [isQuoteModalOpen, setQuoteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState("");
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchBooks = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/list`,
                    {
                        withCredentials: true,
                    }
                );

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
                updateBooksReadCount(books.read.length);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookshelf data:", err);
                setError("Error fetching bookshelf data.");
                setLoading(false);
            }
        };

        fetchBooks();
    }, [userId, updateBooksReadCount]);

    const handleAddBookClick = (category) => {
        setCurrentCategory(category);
        setModalOpen(true);
        setError(null);
    };

    const handleAddQuoteClick = (bookId) => {
        setSelectedBookId(bookId);
        setQuoteModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const closeQuoteModal = () => {
        setSelectedBookId(null);
        setQuoteModalOpen(false);
    };

    const handleRemoveBook = async (bookId, category) => {
        const confirmed = window.confirm("Are you sure you want to delete this book?");
        if (!confirmed) return;
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/delete/${bookId}`,
                {
                    withCredentials: true,
                }
            );

            setBookShelf((prevShelf) => ({
                ...prevShelf,
                [category]: prevShelf[category].filter((book) => book.book_id !== bookId),
            }));
        } catch (err) {
            console.error("Error removing book:", err);
            setError("Error removing book.");
        }
    };

    const handleBookClick = (book_id) => {
        const url = `/books/${book_id}`;
        window.open(url, "noopener noreferrer");
    };
    const onBookAdded = (newBook) => {
        setBookShelf((prevShelf) => ({
            ...prevShelf,
            [currentCategory]: [...prevShelf[currentCategory], newBook],
        }));
    };

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
                        <div key={book.book_id} className={styles.bookContainer}>
                            <div className={styles.bookImageWrapper}>
                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    className={styles.bookImage}
                                    onClick={() => handleBookClick(book.book_id)}
                                />
                                <span className={styles.newTabIcon}>🔗</span>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => handleRemoveBook(book.book_id, "read")}
                            >
                                &times;
                            </button>
                            <button
                                className={styles.quoteButton}
                                onClick={() => handleAddQuoteClick(book.book_id)}
                            >
                                Add Quote
                            </button>
                        </div>
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
                        <div key={book.book_id} className={styles.bookContainer}>
                            <div className={styles.bookImageWrapper}>
                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    className={styles.bookImage}
                                    onClick={() => handleBookClick(book.book_id)}
                                />
                                <span className={styles.newTabIcon}>🔗</span>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => handleRemoveBook(book.book_id, "currentlyReading")}
                            >
                                &times;
                            </button>
                            <button
                                className={styles.quoteButton}
                                onClick={() => handleAddQuoteClick(book.book_id)}
                            >
                                Add Quote
                            </button>
                        </div>
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
                        <div key={book.book_id} className={styles.bookContainer}>
                            <div className={styles.bookImageWrapper}>
                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    className={styles.bookImage}
                                    onClick={() => handleBookClick(book.book_id)}
                                />
                                <span className={styles.newTabIcon}>🔗</span>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => handleRemoveBook(book.book_id, "wishToRead")}
                            >
                                &times;
                            </button>
                            <button
                                className={styles.quoteButton}
                                onClick={() => handleAddQuoteClick(book.book_id)}
                            >
                                Add Quote
                            </button>
                        </div>
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
                        <AddBookToBookshelf
                            category={currentCategory}
                            onBookAdded={onBookAdded}
                            bookShelf={bookShelf}
                            closeModal={closeModal}
                        />
                    </div>
                </div>
            )}

            {isQuoteModalOpen && (
                <FavoriteQuote
                    bookId={selectedBookId}
                    userId={userId}
                    closeModal={closeQuoteModal}
                />
            )}
        </div>
    );
};

export default Bookshelf;
