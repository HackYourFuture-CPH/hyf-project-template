import React, { useState, useEffect } from "react";
import styles from "./Bookshelf.module.css";
import axios from "axios";
import BookshelfSection from "./BookshelfSection";
import AddBookToBookshelf from "./AddBookToBookshelf";
import FavoriteQuote from "./FavoriteQuote";

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

                        if (book.is_favorite) {
                            acc.favorites = acc.favorites || [];
                            acc.favorites.push(book);
                        }

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

    const toggleFavorite = async (bookId, category) => {
        try {
            const book = bookShelf[category].find((b) => b.book_id === bookId);
            const updatedIsFavorite = !book.is_favorite;

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/favorite/${bookId}`,
                { is_favorite: updatedIsFavorite },
                {
                    withCredentials: true,
                }
            );

            setBookShelf((prevShelf) => ({
                ...prevShelf,
                [category]: prevShelf[category].map((b) =>
                    b.book_id === bookId ? { ...b, is_favorite: updatedIsFavorite } : b
                ),
            }));
        } catch (err) {
            console.error("Error toggling favorite:", err);
            setError("Error updating favorite status.");
        }
    };

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

            <BookshelfSection
                title="Read"
                books={bookShelf.read}
                category="read"
                onAddBookClick={handleAddBookClick}
                onBookClick={handleBookClick}
                onToggleFavorite={toggleFavorite}
                onAddQuoteClick={handleAddQuoteClick}
                onRemoveBook={handleRemoveBook}
            />

            <BookshelfSection
                title="Currently Reading"
                books={bookShelf.currentlyReading}
                category="currentlyReading"
                onAddBookClick={handleAddBookClick}
                onBookClick={handleBookClick}
                onToggleFavorite={toggleFavorite}
                onAddQuoteClick={handleAddQuoteClick}
                onRemoveBook={handleRemoveBook}
            />

            <BookshelfSection
                title="Wish to Read"
                books={bookShelf.wishToRead}
                category="wishToRead"
                onAddBookClick={handleAddBookClick}
                onBookClick={handleBookClick}
                onToggleFavorite={toggleFavorite}
                onAddQuoteClick={handleAddQuoteClick}
                onRemoveBook={handleRemoveBook}
            />

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
