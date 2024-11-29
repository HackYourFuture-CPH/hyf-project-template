"use client";
import { memo, useState, useEffect, useCallback, useRef } from "react";
import styles from "./BookGrid.module.css";

const BookCard = memo(({ book, onAddBook }) => {
  const [isAdding, setIsAdding] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await onAddBook(book);
    } finally {
      setIsAdding(false);
    }
  }, [book, onAddBook, isAdding]);

  return (
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
  );
});

const BookGrid = memo(({ books, onAddBook, loading }) => {
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!books.length) {
    return <div className={styles.noResults}>No books found</div>;
  }

  return (
    <div className={styles.bookGrid}>
      {books.map((book) => (
        <BookCard key={book.google_book_id} book={book} onAddBook={onAddBook} />
      ))}
    </div>
  );
});

BookCard.displayName = "BookCard";
BookGrid.displayName = "BookGrid";

export default BookGrid;
