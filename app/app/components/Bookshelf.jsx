"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./Bookshelf.module.css";
import axios from "axios";
import BookshelfSection from "./BookshelfSection";
import AddBookToBookshelf from "./AddBookToBookshelf";
import FavoriteQuote from "./FavoriteQuote";
import { useBookshelf } from "../contexts/BooksReadCountContext";

const Bookshelf = () => {
  const { bookShelf, setBookShelf, loading, error } = useBookshelf();
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isQuoteModalOpen, setQuoteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const allFavorites = [
      ...bookShelf.read.filter((book) => book.is_favorite),
      ...bookShelf.currentlyReading.filter((book) => book.is_favorite),
      ...bookShelf.wishToRead.filter((book) => book.is_favorite),
    ];
    setFavorites(allFavorites);
  }, [bookShelf]);

  const toggleFavorite = useCallback(
    async (bookId, category) => {
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

        setFavorites((prevFavorites) => {
          if (updatedIsFavorite) {
            return [
              ...prevFavorites,
              { ...book, is_favorite: updatedIsFavorite },
            ];
          } else {
            return prevFavorites.filter((b) => b.book_id !== bookId);
          }
        });

        setBookShelf((prevShelf) => ({
          ...prevShelf,
          [category]: prevShelf[category].map((b) =>
            b.book_id === bookId ? { ...b, is_favorite: updatedIsFavorite } : b
          ),
        }));
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    },
    [bookShelf, setBookShelf]
  );

  const handleAddBookClick = (category) => {
    setCurrentCategory(category);
    setModalOpen(true);
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
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
        [category]: prevShelf[category].filter(
          (book) => book.book_id !== bookId
        ),
      }));
    } catch (err) {
      console.error("Error removing book:", err);
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
        <FavoriteQuote bookId={selectedBookId} closeModal={closeQuoteModal} />
      )}
    </div>
  );
};

export default Bookshelf;
