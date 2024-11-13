import knex from "../database_client.js";
import fetch from "node-fetch";

const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

export const addBookToUser = async (req, res) => {
  const userId = req.user.userId;
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
    google_books_id: google_books_id,
    title,
    author,
    genre,
    cover_image,
    description,
  };

  if (!title || !author || !genre || !cover_image || !description) {
    try {
      const googleBooksResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${google_books_id}?key=${googleBooksApiKey}`
      );
      const googleBook = await googleBooksResponse.json();
      if (!googleBook) {
        return res.status(404).json({ error: "Book not found" });
      }
      const volumeInfo = googleBook.volumeInfo;
      bookData.title = title || volumeInfo.title;
      bookData.author =
        author || volumeInfo.authors ? volumeInfo.authors[0] : "Unknown";
      bookData.genre =
        genre || volumeInfo.categories ? volumeInfo.categories[0] : null;
      bookData.cover_image =
        cover_image || volumeInfo.imageLinks?.thumbnail || null;
      bookData.description = description || volumeInfo.description || null;
    } catch (error) {
      console.error("Error fetching book details from Google Books:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
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
          user_id: userId,
          book_id: book.book_id,
        })
        .first();

      if (existingUserBook) {
        return res
          .status(400)
          .json({ error: "Book already exists in user's library" });
      }
      await trx("UserBooks").insert({
        user_id: userId,
        book_id: book.book_id,
        status,
        start_date,
        end_date,
      });

      return await trx("Books")
        .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
        .where({ "UserBooks.user_id": userId, "Books.book_id": book.book_id })
        .select(
          "Books.*",
          "UserBooks.status",
          "UserBooks.start_date",
          "UserBooks.end_date"
        )
        .first();
    });

    return res.status(201).json({
      message: "Book added to user's library successfully",
      book: result,
    });
  } catch (error) {
    console.error("Error adding book to user:", error);
    if (error.message === "Book already exists in user's library") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Missing required fields") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserBooks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userBooks = await knex("Books")
      .join("UserBooks", "Books.book_id", "=", "UserBooks.book_id")
      .where({ "UserBooks.user_id": userId })
      .select(
        "Books.*",
        "UserBooks.status",
        "UserBooks.start_date",
        "UserBooks.end_date"
      );

    return res.status(200).json(userBooks);
  } catch (error) {
    console.error("Error fetching user books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBookDetails = async (req, res) => {
  const userId = req.user.userId;
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
    return res.status(200).json(updatedBook);
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

    return res.status(200).json(updatedBook);
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
