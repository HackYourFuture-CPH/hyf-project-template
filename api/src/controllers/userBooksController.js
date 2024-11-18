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
    title,
    author,
    genre,
    cover_image,
    description,
    status = "read",
    start_date = null,
    end_date = null,
  } = req.body;

  if (!google_books_id) {
    return res.status(400).json({ error: "google_book_id is required" });
  }

  let bookData = {
    google_books_id,
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
    return res
      .status(404)
      .json({ error: "Book not found in Google Books API" });
  }

  try {
    const result = await knex.transaction(async (trx) => {
      let book = await trx("Books")
        .where({ google_books_id: bookData.google_books_id })
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

      if (existingUserBook) {
        res
          .status(400)
          .json({ error: "Book already exists in user's library" });
        return;
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
        .select(
          "Books.*",
          "UserBooks.status",
          "UserBooks.start_date",
          "UserBooks.end_date"
        )
        .first();
    });
    if (!result) {
      // if result is undefined, it means the book already exists in the user's library, and we've already sent a response
      return;
    }

    return res.status(201).json({
      message: "Book added to user's library successfully",
      book: buildUserBookDto(result),
    });
  } catch (error) {
    console.error("Error adding book to user's library:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
          "UserBooks.end_date"
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
        "UserBooks.end_date"
      );

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
      .select(
        "Books.*",
        "UserBooks.status",
        "UserBooks.start_date",
        "UserBooks.end_date"
      )
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
