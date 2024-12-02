"use client";
import { useState, useEffect, useCallback } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import styles from "./Bookshelf.module.css";
import axios from "axios";
import BookshelfSection from "./BookshelfSection";
import AddBookToBookshelf from "./AddBookToBookshelf";
import FavoriteQuote from "./FavoriteQuote";
import ConfirmationModal from "./ConfirmationModal";
import { useErrorModal } from "../hooks/useErrorModal";
import ErrorModal from "./ErrorModal";
import { useBookshelf } from "../contexts/BooksReadCountContext";
import { useTheme } from "../contexts/ThemeContext"; // Assuming ThemeContext is available

const Bookshelf = () => {
  const { theme } = useTheme(); // Access the theme
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const { bookShelf, setBookShelf, loading } = useBookshelf();
  const { showError, error, hideError } = useErrorModal();
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setQuoteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bookToRemove, setBookToRemove] = useState(null);

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
        showError(
          "Failed to update favorite status. Please try again.",
          "Update Failed",
          "error"
        );
      }
    },
    [bookShelf, setBookShelf, showError]
  );

  const handleUpdateReadingStatus = async (bookId, newStatus) => {
    try {
      const now = new Date();

      const formatDateForMySQL = (date) =>
        date.toISOString().slice(0, 19).replace("T", " ");

      let start_date = null;
      let end_date = null;

      if (newStatus === "CURRENTLY READING") {
        start_date = formatDateForMySQL(now);
      } else if (newStatus === "READ") {
        end_date = formatDateForMySQL(now);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/update/${bookId}`,
        {
          status: newStatus,
          start_date,
          end_date,
        },
        {
          withCredentials: true,
        }
      );

      setBookShelf((prevShelf) => {
        console.log("Previous shelf:", prevShelf);
        const updatedShelf = { ...prevShelf };
        let bookToUpdate = null;
        let currentCategory = null;

        for (const category of Object.keys(prevShelf)) {
          const found = prevShelf[category].find(
            (book) => book.book_id === bookId
          );
          if (found) {
            bookToUpdate = found;
            currentCategory = category;
            break;
          }
        }

        if (bookToUpdate && currentCategory) {
          updatedShelf[currentCategory] = prevShelf[currentCategory].filter(
            (book) => book.book_id !== bookId
          );

          const newCategory =
            newStatus === "READ"
              ? "read"
              : newStatus === "CURRENTLY READING"
              ? "currentlyReading"
              : "wishToRead";

          updatedShelf[newCategory] = [
            ...prevShelf[newCategory],
            { ...bookToUpdate, status: newStatus },
          ];
        }

        return updatedShelf;
      });
    } catch (err) {
      console.error("Error updating reading status:", err);
      console.error("Error details:", err.response?.data);
      showError(
        "Failed to update reading status. Please try again.",
        "Update Failed",
        "error"
      );
    }
  };

  const handleAddBook = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleAddQuoteClick = (bookId) => {
    setSelectedBookId(bookId);
    setQuoteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const closeQuoteModal = () => {
    setSelectedBookId(null);
    setQuoteModalOpen(false);
  };

  const handleRemoveBook = async (bookId, category) => {
    setBookToRemove({ bookId, category });
    setIsConfirmModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!bookToRemove) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/delete/${bookToRemove.bookId}`,
        {
          withCredentials: true,
        }
      );

      setBookShelf((prevShelf) => ({
        ...prevShelf,
        [bookToRemove.category]: prevShelf[bookToRemove.category].filter(
          (book) => book.book_id !== bookToRemove.bookId
        ),
      }));
    } catch (err) {
      console.error("Error removing book:", err);
      showError(
        "Failed to remove book. Please try again.",
        "Delete Failed",
        "error"
      );
    } finally {
      setIsConfirmModalOpen(false);
      setBookToRemove(null);
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

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ color: textColor }}
          sx={{ mt: 2 }}
        >
          Loading bookshelf...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <div className={styles.bookshelf}>
        <div className={styles.bookshelfHeader}>
          {/* <h3 style={{ color: textColor }}>Bookshelf</h3> */}
        </div>

        <BookshelfSection
          title={<span style={{ color: textColor }}>Read</span>}
          books={bookShelf.read}
          category="read"
          onAddBookClick={handleAddBook}
          onBookClick={handleBookClick}
          onToggleFavorite={toggleFavorite}
          onAddQuoteClick={handleAddQuoteClick}
          onRemoveBook={handleRemoveBook}
          onUpdateReadingStatus={handleUpdateReadingStatus}
        />

        <BookshelfSection
          title={<span style={{ color: textColor }}>Currently Reading</span>}
          books={bookShelf.currentlyReading}
          category="currentlyReading"
          onAddBookClick={handleAddBook}
          onBookClick={handleBookClick}
          onToggleFavorite={toggleFavorite}
          onAddQuoteClick={handleAddQuoteClick}
          onRemoveBook={handleRemoveBook}
          onUpdateReadingStatus={handleUpdateReadingStatus}
        />

        <BookshelfSection
          title={<span style={{ color: textColor }}>Wish to Read</span>}
          books={bookShelf.wishToRead}
          category="wishToRead"
          onAddBookClick={handleAddBook}
          onBookClick={handleBookClick}
          onToggleFavorite={toggleFavorite}
          onAddQuoteClick={handleAddQuoteClick}
          onRemoveBook={handleRemoveBook}
          onUpdateReadingStatus={handleUpdateReadingStatus}
        />

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              {isModalOpen && currentCategory && (
                <AddBookToBookshelf
                  category={currentCategory}
                  onBookAdded={onBookAdded}
                  bookShelf={bookShelf}
                  closeModal={handleCloseModal}
                />
              )}
            </div>
          </div>
        )}

        {isQuoteModalOpen && (
          <FavoriteQuote bookId={selectedBookId} closeModal={closeQuoteModal} />
        )}
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setBookToRemove(null);
          }}
          onConfirm={confirmDelete}
          message="Are you sure you want to remove this book from your bookshelf?"
          confirmText="Remove"
          cancelText="Cancel"
        />
      </div>
      <ErrorModal
        isOpen={error.isOpen}
        onClose={hideError}
        message={error.message}
        title={error.title}
        severity={error.severity}
      />
    </>
  );
};

export default Bookshelf;
