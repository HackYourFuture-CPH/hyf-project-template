"use client";
import { useState } from "react";
import SearchForm from "./SearchForm";
import styles from "./AddBookToBookshelf.module.css";
import SuccessModal from "../SuccessModal";

const isBookInCategory = (book, bookShelf, category) => {
  return bookShelf[category].some(
    (b) => b.google_books_id === book.google_book_id
  );
};

const AddBookToBookshelf = ({
  category,
  onBookAdded,
  bookShelf,
  closeModal,
}) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapCategoryToStatus = (category) => {
    const statusMap = {
      read: "READ",
      currentlyReading: "CURRENTLY READING",
      wishToRead: "WISH TO READ",
    };
    return statusMap[category] || "READ";
  };

  const handleAddBook = async (book) => {
    if (isBookInCategory(book, bookShelf, category)) {
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
        onBookAdded(response.data.book);
        setIsModalOpen(true);
        console.log(response.data.book);
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
          setError(`Error: ${err.response.data.error || "An error occurred."}`);
        }
      } else {
        setError("An error occurred while adding the book.");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addBookContainer}>
        <div className={styles.header}>
          <h2>Add Book to {category.replace(/([a-z])([A-Z])/g, "$1 $2")}</h2>
          <button onClick={closeModal} className={styles.closeButton}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <SearchForm onAddBook={handleAddBook} />

        {successMessage && (
          <SuccessModal
            isOpen={isModalOpen}
            message={successMessage}
            onClose={() => {
              setIsModalOpen(false);
              if (closeModal) closeModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddBookToBookshelf;
