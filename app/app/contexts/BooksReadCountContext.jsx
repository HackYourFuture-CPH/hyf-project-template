"use client";
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const BookshelfContext = createContext();

export const useBookshelf = () => useContext(BookshelfContext);

export const BookshelfProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [bookShelf, setBookShelf] = useState({
    read: [],
    currentlyReading: [],
    wishToRead: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/list`,
          { withCredentials: true }
        );

        const books = response.data.reduce(
          (acc, book) => {
            return {
              read: book.status === "READ" ? [...acc.read, book] : acc.read,
              currentlyReading:
                book.status === "CURRENTLY READING"
                  ? [...acc.currentlyReading, book]
                  : acc.currentlyReading,
              wishToRead:
                book.status === "WISH TO READ"
                  ? [...acc.wishToRead, book]
                  : acc.wishToRead,
            };
          },
          { read: [], currentlyReading: [], wishToRead: [] }
        );

        setBookShelf(books);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookshelf data:", err);
        setError("Error fetching bookshelf data.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentUser]);

  const booksCount = bookShelf.read.length;

  return (
    <BookshelfContext.Provider
      value={{ bookShelf, booksCount, loading, error }}
    >
      {children}
    </BookshelfContext.Provider>
  );
};
