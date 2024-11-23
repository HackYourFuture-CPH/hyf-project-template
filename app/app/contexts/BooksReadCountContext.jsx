import { createContext, useState, useContext } from "react";

const BookshelfContext = createContext();

export const useBookshelf = () => useContext(BookshelfContext);

export const BookshelfProvider = ({ children }) => {
  const [bookshelf, setBookshelf] = useState([]);

  const addBook = (book) => {
    setBookshelf([...bookshelf, book]);
  };

  const removeBook = (bookId) => {
    setBookshelf(bookshelf.filter((book) => book.id !== bookId));
  };
  const bookCount = bookshelf.length;

  return (
    <BookshelfContext.Provider
      value={{ bookshelf, addBook, removeBook, bookCount }}
    >
      {children}
    </BookshelfContext.Provider>
  );
};
