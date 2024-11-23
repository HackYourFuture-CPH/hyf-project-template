import { useState, useEffect } from "react";
import styles from "./Bookshelf.module.css";
import axios from "axios";
import BookshelfSection from "./BookshelfSection";

const Bookshelf = ({ userId, updateBooksReadCount }) => {
  const [bookShelf, setBookShelf] = useState({
    read: [],
    currentlyReading: [],
    wishToRead: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/list`,
          { withCredentials: true }
        );

        const books = response.data.reduce(
          (acc, book) => {
            if (book.status === "READ") acc.read.push(book);
            if (book.status === "CURRENTLY READING")
              acc.currentlyReading.push(book);
            if (book.status === "WISH TO READ") acc.wishToRead.push(book);
            return acc;
          },
          { read: [], currentlyReading: [], wishToRead: [] }
        );

        setBookShelf(books);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookshelf data:", err);
        setError("Error fetching bookshelf data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  useEffect(() => {
    if (bookShelf.read) updateBooksReadCount(bookShelf.read.length);
  }, [bookShelf.read, updateBooksReadCount]);

  const handleToggleFavorite = async (bookId, category) => {
    try {
      const book = bookShelf[category].find((b) => b.book_id === bookId);
      const updatedIsFavorite = !book.is_favorite;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/favorite/${bookId}`,
        { is_favorite: updatedIsFavorite },
        { withCredentials: true }
      );

      setBookShelf((prevShelf) => ({
        ...prevShelf,
        [category]: prevShelf[category].map((b) =>
          b.book_id === bookId ? { ...b, is_favorite: updatedIsFavorite } : b
        ),
      }));
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setError("Error updating favorite status.");
    }
  };

  const handleRemoveBook = async (bookId, category) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-books/delete/${bookId}`,
        { withCredentials: true }
      );

      setBookShelf((prevShelf) => {
        const updatedShelf = {
          ...prevShelf,
          [category]: prevShelf[category].filter(
            (book) => book.book_id !== bookId
          ),
        };

        if (category === "read") {
          updateBooksReadCount(updatedShelf.read.length);
        }

        return updatedShelf;
      });
    } catch (err) {
      console.error("Error removing book:", err);
      setError("Error removing book.");
    }
  };
  const handleBookClick = (book_id) => {
    const url = `/books/${book_id}`;
    window.open(url, "noopener noreferrer");
  };

  if (loading) return <p>Loading bookshelf...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.bookshelf}>
      <BookshelfSection
        title="Read"
        books={bookShelf.read}
        category="read"
        onToggleFavorite={handleToggleFavorite}
        onRemoveBook={handleRemoveBook}
        onBookClick={handleBookClick}
      />

      <BookshelfSection
        title="Currently Reading"
        books={bookShelf.currentlyReading}
        category="currentlyReading"
        onToggleFavorite={handleToggleFavorite}
        onRemoveBook={handleRemoveBook}
        onBookClick={handleBookClick}
      />

      <BookshelfSection
        title="Wish to Read"
        books={bookShelf.wishToRead}
        category="wishToRead"
        onToggleFavorite={handleToggleFavorite}
        onRemoveBook={handleRemoveBook}
        onBookClick={handleBookClick}
      />
    </div>
  );
};

export default Bookshelf;
