"use client";
import { memo, useState, useEffect, useCallback, useRef } from "react";
import { useErrorModal } from "@/app/hooks/useErrorModal";
import ErrorModal from "../ErrorModal";
import styles from "./BookGrid.module.css";

const BookCard = memo(({ book, onAddBook, existingBooks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const isMounted = useRef(true);
  const { error, showError, hideError } = useErrorModal();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (isAdding) return;

    if (!book.isbn) {
      showError("This book doesn't have an ISBN. Please try another edition.");
      return;
    }

    setIsAdding(true);
    try {
      await onAddBook(book);
    } catch (err) {
      if (isMounted.current) {
        showError(err.response?.data?.error || "Failed to add book");
      }
    } finally {
      if (isMounted.current) {
        setIsAdding(false);
      }
    }
  }, [book, onAddBook, isAdding, showError]);

  return (
    <>
      <div className={styles.bookCard}>
        <div className={styles.imageWrapper}>
          <img
            src={book.cover_image}
            alt={book.title}
            className={styles.bookImage}
            loading="lazy"
          />
        </div>
        <div className={styles.bookInfo}>
          <h3 className={styles.bookTitle}>{book.title}</h3>
          <p className={styles.bookAuthor}>{book.authors}</p>
          <button
            onClick={handleClick}
            className={`${styles.addButton} ${isAdding ? styles.adding : ""}`}
            disabled={isAdding}
            type="button"
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
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
});

const BookGrid = memo(({ books, onAddBook, loading, existingBooks }) => {
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!books.length) {
    return <div className={styles.noResults}>No books found</div>;
  }

  return (
    <div className={styles.bookGrid}>
      {books.map((book) => (
        <BookCard
          key={book.google_book_id}
          book={book}
          onAddBook={onAddBook}
          existingBooks={existingBooks}
        />
      ))}
    </div>
  );
});

BookCard.displayName = "BookCard";
BookGrid.displayName = "BookGrid";

export default BookGrid;
