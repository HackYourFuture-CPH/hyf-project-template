export const buildUserBookDto = (book) => {
    return {
        book_id: book.book_id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        cover_image: book.cover_image,
        description: book.description,
        google_books_id: book.google_books_id,
        created_at: book.created_at,
        status: book.status,
        start_date: book.start_date,
        end_date: book.end_date,
        is_favorite: book.is_favorite,
    };
};
