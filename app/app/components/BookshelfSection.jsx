"use client";
import React, { useState } from "react";
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
  const [showAll, setShowAll] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredBookId, setHoveredBookId] = useState(null);

  // Determine whether to show the "See More" button
  const hasMoreBooks = books.length > 10;

  // Control the books displayed based on the "See More" state
  const displayedBooks = showAll ? books : books.slice(0, 10);

  const handleSeeMoreClick = () => {
    setShowAll(true);
  };

  const handleSeeLessClick = () => {
    setShowAll(false);
  };

  return (
    <div className={styles.bookshelfSection}>
      <p>{title}:</p>
      <div className={styles.bookshelfImages}>
        {displayedBooks.map((book) => (
          <div
            key={book.book_id}
            className={`${styles.bookContainer} ${
              book.is_fallback ? styles.fallbackBook : ""
            }`}
            onMouseEnter={() => setHoveredBookId(book.book_id)}
            onMouseLeave={() => setHoveredBookId(null)}
          >
            <div className={styles.bookContent}>
              <div className={styles.bookImageWrapper}>
                <img
                  src={book.cover_image}
                  alt={book.title}
                  //className={styles.bookImage}
                  onClick={() => onBookClick(book.book_id)}
                  data-tooltip="Go to the book's page"
                  className={`${styles.bookImage} ${
                    book.is_fallback ? styles.fallbackImage : ""
                  }`}
                />
                {book.is_fallback && (
                  <div className={styles.hoverMessage}>
                    This is not the real book image
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${styles.optionsMenu} ${
                hoveredBookId === book.book_id ? styles.show : ""
              }`}
            >
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

      {hasMoreBooks && (
        <div className={styles.seeMoreContainer}>
          {!showAll ? (
            <button
              className={styles.seeMoreButton}
              onClick={handleSeeMoreClick}
              data-tooltip="See More"
            >
              <img
                src="more.png"
                alt="See More"
                className={styles.buttonIcon}
              />
            </button>
          ) : (
            <button
              className={styles.seeLessButton}
              onClick={handleSeeLessClick}
              data-tooltip="See Less"
            >
              <img
                src="more.png"
                alt="See Less"
                className={styles.buttonIcon}
              />
            </button>
          )}
        </div>
      )}
      <div className={styles.divider}></div>
    </div>
  );
};

export default BookshelfSection;
