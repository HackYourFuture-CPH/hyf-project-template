import fetch from "node-fetch";
import knex from "../database_client.js";
import { buildBookDto } from "../services/bookService.js";
import { buildUserBookDto } from "../services/userBookService.js";

const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

const fetchGoogleBooksDetails = async (googleBooksId) => {
    try {
        const googleBooksResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${googleBooksId}?key=${googleBooksApiKey}`
        );
        const data = await googleBooksResponse.json();
        if (!data.volumeInfo) {
            throw new Error("Book details not found");
        }
        return {
            title: data.volumeInfo.title,
            author: data.volumeInfo.authors ? data.volumeInfo.authors[0] : "Unknown",
            genre: data.volumeInfo.categories ? data.volumeInfo.categories[0] : null,
            cover_image: data.volumeInfo.imageLinks?.thumbnail || null,
            description: data.volumeInfo.description || null,
        };
    } catch (error) {
        console.error("Error fetching book details from Google Books:", error);
        throw new Error("Error fetching book details from Google Books");
    }
};
export const addBookToUser = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== "user") {
        return res
            .status(403)
            .json({ error: "Forbidden: You do not have permission to add books." });
    }

    const {
        google_books_id,
        isbn,
        title,
        author,
        genre,
        cover_image,
        description,
        status = "read",
        start_date = null,
        end_date = null,
    } = req.body;

    if (!google_books_id && !isbn) {
        return res.status(400).json({ error: "google_book_id or isbn is required" });
    }

    let bookData = {
        google_books_id,
        isbn,
        title,
        author,
        genre,
        cover_image,
        description,
    };

    try {
        if (!title || !author || !genre || !cover_image || !description) {
            const googleBooksDetails = await fetchGoogleBooksDetails(google_books_id);
            bookData = { ...bookData, ...googleBooksDetails };
        }
    } catch (error) {
        console.error("Error fetching book details from Google Books:", error);
        return res.status(404).json({ error: "Book not found in Google Books API" });
    }

    try {
        const result = await knex.transaction(async (trx) => {
            let book = await trx("Books")
                .where(function () {
                    if (bookData.isbn) {
                        this.where({ isbn: bookData.isbn });
                    } else if (bookData.google_books_id) {
                        this.where({ google_books_id: bookData.google_books_id });
                    }
                })
                .first();

            if (!book) {
                const [bookId] = await trx("Books").insert(bookData);
                book = await trx("Books").where({ book_id: bookId }).first();
            }

            const existingUserBook = await trx("UserBooks")
                .where({
                    user_id: req.user.userId,
                    book_id: book.book_id,
                })
                .first();

            console.log("Existing User Book:", existingUserBook);

            if (existingUserBook && existingUserBook.status === status) {
                console.log(existingUserBook);
                console.log(existingUserBook.status);
                console.log(status);
                res.status(400).json({
                    error: `Book already exists in the library with the same status.`,
                });
                return;
            }

            if (existingUserBook && existingUserBook.status !== status) {
                await trx("UserBooks")
                    .where({
                        user_id: req.user.userId,
                        book_id: book.book_id,
                    })
                    .update({
                        status,
                        start_date,
                        end_date,
                    });

                const updatedBook = await trx("Books")
                    .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
                    .where({
                        "UserBooks.user_id": req.user.userId,
                        "Books.book_id": book.book_id,
                    })
                    .select(
                        "Books.*",
                        "UserBooks.status",
                        "UserBooks.start_date",
                        "UserBooks.end_date"
                    )
                    .first();

                return res.status(200).json({
                    message: "Book status updated successfully.",
                    book: buildUserBookDto(updatedBook),
                });
            }

            await trx("UserBooks").insert({
                user_id: req.user.userId,
                book_id: book.book_id,
                status,
                start_date,
                end_date,
            });

            return await trx("Books")
                .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
                .where({
                    "UserBooks.user_id": req.user.userId,
                    "Books.book_id": book.book_id,
                })
                .select("Books.*", "UserBooks.status", "UserBooks.start_date", "UserBooks.end_date")
                .first();
        });

        if (!result) {
            return res.status(500).json({ error: "Failed to add book to the user's library." });
        }

        res.status(201).json({
            message: "Book added to user's library successfully",
            book: buildUserBookDto(result),
        });
        return;
    } catch (error) {
        console.error("Error adding book to user's library:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        // return;
    }
};

export const getUserBooks = async (req, res) => {
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        if (userRole !== "admin" && userRole !== "user") {
            return res.status(403).json({
                error: "Forbidden: You do not have permission to view books.",
            });
        }
        if (userRole === "admin") {
            const allUserBooks = await knex("Books")
                .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
                .select(
                    "Books.*",
                    "UserBooks.user_id",
                    "UserBooks.status",
                    "UserBooks.start_date",
                    "UserBooks.end_date",
                    "UserBooks.is_favorite"
                );
            return res.status(200).json(allUserBooks.map(buildUserBookDto));
        }
        const userBooks = await knex("Books")
            .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
            .where({ "UserBooks.user_id": userId })
            .select(
                "Books.*",
                "UserBooks.status",
                "UserBooks.start_date",
                "UserBooks.end_date",
                "UserBooks.is_favorite"
            );
        console.log(userBooks);
        return res.status(200).json(userBooks.map(buildUserBookDto));
    } catch (error) {
        console.error("Error fetching user books:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateBookDetails = async (req, res) => {
    const { bookId, title, author, genre, description, cover_image } = req.body;

    try {
        const book = await knex("Books").where({ book_id: bookId }).first();
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        await knex("Books")
            .where({ book_id: bookId })
            .update({
                title: title || book.title,
                author: author || book.author,
                genre: genre || book.genre,
                description: description || book.description,
                cover_image: cover_image || book.cover_image,
            });
        const updatedBook = await knex("Books").where({ book_id: bookId }).first();
        return res.status(200).json(buildBookDto(updatedBook));
    } catch (error) {
        console.error("Error updating book details:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateUserBook = async (req, res) => {
    const userId = req.user.userId;
    const { bookId } = req.params;
    const { status, start_date, end_date } = req.body;

    try {
        const userBook = await knex("UserBooks")
            .where({ user_id: userId, book_id: bookId })
            .first();

        if (!userBook) {
            return res.status(404).json({ error: "User book not found" });
        }

        await knex("UserBooks")
            .where({ user_id: userId, book_id: bookId })
            .update({ status, start_date, end_date });

        const updatedBook = await knex("Books")
            .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
            .where({ "UserBooks.user_id": userId, "Books.book_id": bookId })
            .select("Books.*", "UserBooks.status", "UserBooks.start_date", "UserBooks.end_date")
            .first();

        return res.status(200).json(buildUserBookDto(updatedBook));
    } catch (error) {
        console.error("Error updating user book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteUserBook = async (req, res) => {
    const userId = req.user.userId;
    const { bookId } = req.params;

    try {
        const userBook = await knex("UserBooks")
            .where({ user_id: userId, book_id: bookId })
            .first();

        if (!userBook) {
            return res.status(404).json({ error: "User book not found" });
        }

        await knex("UserBooks").where({ user_id: userId, book_id: bookId }).del();

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting user book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFavoriteGenreAndAuthor = async (req, res) => {
    const userId = req.user.userId;

    try {
        const favoriteAuthors = await knex("Books")
            .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
            .where({ "UserBooks.user_id": userId, "UserBooks.is_favorite": 1 }) // Filter for favorite books
            .groupBy("Books.author")
            .select("Books.author")
            .count("Books.author as author_count")
            .orderBy("author_count", "desc");

        const maxAuthorCount = favoriteAuthors[0]?.author_count || 0; // Get the max count
        const topAuthors = favoriteAuthors
            .filter((author) => author.author_count === maxAuthorCount)
            .slice(0, 3); // Limit to 3 authors in case of ties

        const mostReadGenres = await knex("Books")
            .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
            .where({ "UserBooks.user_id": userId, "UserBooks.status": "READ" }) // Filter for read books
            .groupBy("Books.genre")
            .select("Books.genre")
            .count("Books.genre as genre_count")
            .orderBy("genre_count", "desc");

        const maxGenreCount = mostReadGenres[0]?.genre_count || 0; // Get the max count
        const topGenres = mostReadGenres
            .filter((genre) => genre.genre_count === maxGenreCount)
            .slice(0, 3); // Limit to 3 genres in case of ties

        return res.status(200).json({
            favoriteAuthors: topAuthors.map((author) => author.author) || ["Not available"],
            mostReadGenres: topGenres.map((genre) => genre.genre) || ["Not available"],
        });
    } catch (error) {
        console.error("Error fetching favorite author or most read genre:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const toggleFavorite = async (req, res) => {
    const { bookId } = req.params;
    const { userId } = req.user;
    const { is_favorite } = req.body;

    try {
        // Check if the book exists in the UserBooks table for the user
        const userBook = await knex("UserBooks")
            .where({ book_id: bookId, user_id: userId })
            .first();

        if (!userBook) {
            return res.status(404).json({ error: "Book not found in user's bookshelf" });
        }

        // Update the is_favorite status
        await knex("UserBooks").where({ book_id: bookId, user_id: userId }).update({ is_favorite });

        return res.status(200).json({ message: "Favorite status updated successfully." });
    } catch (error) {
        console.error("Error toggling favorite status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTopBooks = async (req, res) => {
    try {
        const topBooksQuery = `
            SELECT 
                (SELECT JSON_OBJECT('book_id', b.book_id, 'title', b.title, 'author', b.author, 'cover_image', b.cover_image)
                 FROM UserBooks ub
                 JOIN Books b ON ub.book_id = b.book_id
                 WHERE ub.is_favorite = 1
                 GROUP BY ub.book_id
                 ORDER BY COUNT(*) DESC
                 LIMIT 1) AS most_favorite_book,

                (SELECT JSON_OBJECT('book_id', b.book_id, 'title', b.title, 'author', b.author, 'cover_image', b.cover_image)
                 FROM UserBooks ub
                 JOIN Books b ON ub.book_id = b.book_id
                 WHERE ub.status = 'READ'
                 GROUP BY ub.book_id
                 ORDER BY COUNT(*) DESC
                 LIMIT 1) AS most_read_book,

                (SELECT JSON_OBJECT('book_id', b.book_id, 'title', b.title, 'author', b.author, 'cover_image', b.cover_image)
                 FROM UserBooks ub
                 JOIN Books b ON ub.book_id = b.book_id
                 WHERE ub.status = 'CURRENTLY READING'
                 GROUP BY ub.book_id
                 ORDER BY COUNT(*) DESC
                 LIMIT 1) AS most_currently_reading_book,

                (SELECT JSON_OBJECT('book_id', b.book_id, 'title', b.title, 'author', b.author, 'cover_image', b.cover_image)
                 FROM UserBooks ub
                 JOIN Books b ON ub.book_id = b.book_id
                 WHERE ub.status = 'WISH TO READ'
                 GROUP BY ub.book_id
                 ORDER BY COUNT(*) DESC
                 LIMIT 1) AS most_wish_list_book;
        `;

        const [result] = await knex.raw(topBooksQuery);

        return res.status(200).json({
            most_favorite_book: result[0].most_favorite_book || {},
            most_read_book: result[0].most_read_book || {},
            most_currently_reading_book: result[0].most_currently_reading_book || {},
            most_wish_list_book: result[0].most_wish_list_book || {},
        });
    } catch (error) {
        console.error("Error fetching top books:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
