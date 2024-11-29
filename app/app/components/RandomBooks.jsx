"use client";
import { useState, useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useErrorModal } from "../hooks/useErrorModal";
import ErrorModal from "./ErrorModal";
import styles from "./RandomBooks.module.css";

const RandomBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, error, hideError } = useErrorModal();

  useEffect(() => {
    const fetchBooks = async () => {
      const cachedBooks = localStorage.getItem("books");
      if (cachedBooks) {
        try {
          const randomBooks = JSON.parse(cachedBooks);
          if (Array.isArray(randomBooks) && randomBooks.length > 0) {
            setBooks(randomBooks);
          } else {
            throw new Error("No books in cache, fetching from API");
          }
        } catch (error) {
          console.error("Error parsing cached books:", error);
          localStorage.removeItem("books");
        }
        setLoading(false);
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/random-books`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch books");
          }
          let data = await response.json();

          if (!data.items || data.items.length === 0) {
            const fallbackResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/books`
            );
            const fallbackData = await fallbackResponse.json();
            data = { items: fallbackData };
          }

          const booksData = Array.isArray(data.items) ? data.items : [];
          console.log("Fetched Books: ", booksData);
          localStorage.setItem("books", JSON.stringify({ items: booksData }));
          setBooks(booksData);
        } catch (error) {
          console.error("Error on Fetching", error);
          showError(
            "Failed to load books. Please try again later.",
            "Loading Error",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooks();
  }, []);

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
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading books...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <div className={styles.popularBooks}>
        <h2 className={styles.title}>Popular Books of the Week</h2>

        <div className={styles.booksContainer}>
          {books && books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className={styles.bookCard}>
                <a
                  href={book.volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bookLink}
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "fallback-image-url"
                    }
                    alt={book.volumeInfo.title}
                    title={book.volumeInfo.subtitle}
                    className={styles.bookImage}
                  />
                </a>

                <h3 className={styles.bookTitle}>
                  {book.volumeInfo.title.slice(0, 40)}
                </h3>
              </div>
            ))
          ) : (
            <p>No books available</p>
          )}
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
};

export default RandomBooks;
