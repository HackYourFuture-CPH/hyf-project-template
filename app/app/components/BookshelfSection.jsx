"use client";
import React from "react";
import styles from "./BookshelfSection.module.css";
import Button from "../components/Button";

const BookshelfSection = ({
  title,
  books,
  category,
  onAddBookClick,
  onBookClick,
  onToggleFavorite,
  onAddQuoteClick,
  onRemoveBook,
}) => {
  return (
    <div className={styles.bookshelfSection}>
      <p>{title}:</p>
      <div className={styles.bookshelfImages}>
        {books.map((book) => (
          <div key={book.book_id} className={styles.bookContainer}>
            <div className={styles.bookImageWrapper}>
              <img
                src={book.cover_image}
                alt={book.title}
                className={styles.bookImage}
                onClick={() => onBookClick(book.book_id)}
                data-tooltip="Go to the book's page"
              />
            </div>
            <div className={styles.optionsMenu}>
              <button
                className={styles.optionButton}
                onClick={() => onBookClick(book.book_id)}
                data-tooltip="Go to the book's page"
              >
                🔗
              </button>
              <button
                className={styles.optionButton}
                onClick={() => onToggleFavorite(book.book_id, category)}
                data-tooltip="Add to favorite books"
              >
                {book.is_favorite ? "❤️" : "🤍"}
              </button>
              <button
                className={styles.optionButton}
                onClick={() => onAddQuoteClick(book.book_id)}
                data-tooltip="Add a quote"
              >
                ✍️
              </button>
              <button
                className={styles.optionButton}
                onClick={() => onRemoveBook(book.book_id, category)}
                data-tooltip="Remove book"
              >
                &times;
              </button>
            </div>
          </div>
        ))}

        <Button
          className={styles.addBookButton}
          onClick={() => onAddBookClick(category)}
        >
          ADD BOOK
        </Button>
      </div>
      <div className={styles.divider}></div>
    </div>
  );
};

export default BookshelfSection;
