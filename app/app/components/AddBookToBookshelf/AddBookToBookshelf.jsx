"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import SearchForm from "./SearchForm";
import SuccessModal from "../SuccessModal";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./AddBookToBookshelf.module.css";

const AddBookToBookshelf = ({
  category,
  onBookAdded,
  bookShelf,
  closeModal,
}) => {
  const { theme } = useTheme(); // Access theme context
  const isDarkMode = theme === "dark";

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const mapCategoryToStatus = (category) => {
    const statusMap = {
      read: "READ",
      currentlyReading: "CURRENTLY READING",
      wishToRead: "WISH TO READ",
    };
    return statusMap[category] || "READ";
  };

  const handleAddBook = useCallback(
    async (book) => {
      const isBookInCategory = bookShelf[category]?.some(
        (b) => b.isbn === book.isbn && book.isbn !== null
      );

      if (isBookInCategory) {
        setError(`This book is already in your ${category} category.`);
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
            isbn: book.isbn,
            title: book.title,
            author: book.authors,
            genre: book.genre,
            cover_image: book.cover_image,
            description: book.description,
            status,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setSuccessMessage(
            `${response.data.book.title} added to your ${category} bookshelf.`
          );
          setIsSuccessModalOpen(true);
          onBookAdded(response.data.book);
        }
      } catch (err) {
        if (err.response && err.response.data.error) {
          if (
            err.response.data.error === "Book already exists in user's library"
          ) {
            setError(
              "This book is already in your library under a different status."
            );
          } else {
            setError(
              `Error: ${err.response.data.error || "An error occurred."}`
            );
          }
        } else {
          setError("An error occurred while adding the book.");
        }
      }
    },
    [category, bookShelf, onBookAdded]
  );

  const handleSuccessModalClose = useCallback(() => {
    setIsSuccessModalOpen(false);
    closeModal();
  }, [closeModal]);

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.addBookContainer} ${
          isDarkMode ? styles.darkMode : styles.lightMode
        }`}
      >
        <div className={styles.header}>
          <h2 className={isDarkMode ? styles.darkTitle : styles.lightTitle}>
            Add Book to {category.split(/(?=[A-Z])/).join(" ")}
          </h2>
          <button onClick={closeModal} className={styles.closeButton}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <SearchForm
          onAddBook={handleAddBook}
          existingBooks={bookShelf[category] || []}
          bookShelf={bookShelf}
          category={category}
        />

        {successMessage && (
          <SuccessModal
            isOpen={isSuccessModalOpen}
            message={successMessage}
            onClose={handleSuccessModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AddBookToBookshelf;
