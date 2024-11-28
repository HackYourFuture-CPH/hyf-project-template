"use client";
import { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import styles from "./AddBookToBookshelf.module.css";

const isBookInCategory = (book, bookShelf) => {
  return (
    bookShelf.read.some((b) => b.google_book_id === book.google_book_id) ||
    bookShelf.currentlyReading.some(
      (b) => b.google_book_id === book.google_book_id
    ) ||
    bookShelf.wishToRead.some((b) => b.google_book_id === book.google_book_id)
  );
};

// const isBookInCategory = (book, bookShelf, category) => {
//   return bookShelf[category].some(
//     (b) => b.google_book_id === book.google_book_id
//   );
// };

const AddBookToBookshelf = ({
  category,
  onBookAdded,
  bookShelf,
  closeModal,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const debouncedFetchSearchResults = debounce(async (title, author, genre) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/searchGoogleBooks`,
        {
          params: {
            title: title || undefined,
            author: author || undefined,
            genre: genre || undefined,
            page: 1,
            pageSize: 10,
          },
        }
      );
      setSearchResults(response.data || []);
    } catch (err) {
      setError("An error occurred while fetching the search results.");
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = () => {
    debouncedFetchSearchResults(title, author, genre);
  };

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
        console.log(response.status, response.data);
        closeModal();
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
        <h2>Add Book to {category.replace(/([a-z])([A-Z])/g, "$1 $2")}</h2>
        <button onClick={closeModal} className={styles.closeButton}>
          &times;
        </button>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className={styles.searchInput}
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            className={styles.searchInput}
          />
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Enter genre"
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Search
          </button>
        </div>
        {loading && <p className={styles.loading}>Loading...</p>}

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {!loading && !error && searchResults.length > 0 && (
          <div className={styles.resultsContainer}>
            <ul className={styles.resultsList}>
              {searchResults.map((result, index) => (
                <li
                  key={`${result.google_book_id}-${index}`}
                  className={styles.resultItem}
                >
                  {result.cover_image && (
                    <img
                      src={result.cover_image}
                      alt={result.title}
                      className={styles.bookImage}
                    />
                  )}
                  <div className={styles.bookDetails}>
                    <h4>{result.title}</h4>
                    <p>{result.authors || "Unknown Author"}</p>
                  </div>
                  <button
                    onClick={() => handleAddBook(result)}
                    className={styles.addButton}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBookToBookshelf;
