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
        <div key={book.id} className={styles.bookCard}>
          <img
            src={book.volumeInfo.imageLinks?.thumbnail}
            alt={book.volumeInfo.title}
            className={styles.bookImage}
          />
          <div className={styles.bookDetails}>
            <h4>{book.volumeInfo.title}</h4>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
          </div>
          <button onClick={() => onAddBook(book)} className={styles.addButton}>
            Add to Bookshelf
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
