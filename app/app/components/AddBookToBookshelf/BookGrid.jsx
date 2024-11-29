import styles from "./BookGrid.module.css";

const BookGrid = ({ books, onAddBook, loading }) => {
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!books.length) {
    return <div className={styles.noResults}>No books found</div>;
  }
  return (
    <div className={styles.bookGrid}>
      {books.map((book) => (
        <div key={book.google_book_id} className={styles.bookCard}>
          <div className={styles.imageWrapper}>
            <img
              src={book.cover_image}
              alt={book.title}
              className={styles.bookImage}
            />
          </div>

          <div className={styles.bookInfo}>
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.authors}</p>
            <button
              onClick={() => onAddBook(book)}
              className={styles.addButton}
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
