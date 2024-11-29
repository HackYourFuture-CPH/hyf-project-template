export const buildBookDto = (book) => {
  return {
    id: book.book_id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    cover_image: book.cover_image || "/fallback_4.jpg",
    is_fallback: !book.cover_image,
    description: book.description,
    google_books_id: book.google_books_id,
  };
};
