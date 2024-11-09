import knex from "../database_client.js";
import fetch from "node-fetch";

const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

export const getBooks = async (req, res) => {
  console.log("route is hit");

  try {
    const books = await knex("Books").select("*");
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await knex("Books").where({ book_id: id }).first();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addBook = async (req, res) => {
  const { title, author, genre } = req.body;
  if (!title || !author || !genre) {
    return res
      .status(400)
      .json({ error: "Title, author, and genre are required" });
  }
  try {
    // Check if the book already exists in the database
    const existingBook = await knex("Books").where({ title, author }).first();
    if (existingBook) {
      return res.status(409).json({ error: "Book already exists" });
    }

    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`intitle:${title} inauthor:${author}`)}&maxResults=1&key=${googleBooksApiKey}`;
    const response = await fetch(googleBooksApiUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res
        .status(404)
        .json({ error: "Book not found in Google Books API" });
    }

    const coverImage = data.items[0].volumeInfo.imageLinks
      ? data.items[0].volumeInfo.imageLinks.thumbnail
      : null;
    const google_books_id = data.items[0].id;
    const bookDescription = data.items[0].volumeInfo.description
      ? data.items[0].volumeInfo.description
      : null;

    const [newBookId] = await knex("Books").insert({
      title,
      author,
      genre,
      cover_image: coverImage,
      description: bookDescription,
      google_books_id,
    });

    const newBook = await knex("Books").where({ book_id: newBookId }).first();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Book ID is required" });
  }
  const { title, author, genre, cover_image, description, google_books_id } =
    req.body;
  if (
    !title &&
    !author &&
    !genre &&
    !cover_image &&
    !description &&
    !google_books_id
  ) {
    return res
      .status(400)
      .json({ error: "At least one field is required for update" });
  }

  try {
    let googleBookData = null;
    if (google_books_id) {
      const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes/${google_books_id}`;
      const response = await fetch(googleBooksApiUrl);
      const data = await response.json();
      googleBookData = data;
    }
    if (!cover_image && googleBookData.imageLinks) {
      cover_image = googleBookData.imageLinks.thumbnail;
    }
    if (!description && googleBookData.description) {
      description = googleBookData.description;
    }
    if (!google_books_id && googleBookData.id) {
      google_books_id = googleBookData.id;
    }
    if (!title && googleBookData.title) {
      title = googleBookData.title;
    }
    if (!author && googleBookData.author) {
      author = googleBookData.author;
    }
    if (!genre && googleBookData.genre) {
      genre = googleBookData.genre;
    }

    const updatedRows = await knex("Books").where({ book_id: id }).update({
      title,
      author,
      genre,
      cover_image,
      description,
      google_books_id,
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updatedBook = await knex("Books").where({ book_id: id }).first();
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await knex("Books").where({ book_id: id }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchBooks = async (req, res) => {
  console.log("searchBooks called");
  const { search, genre, sortBy, sortOrder } = req.query;
  try {
    let query = knex("Books");
    if (search) {
      query = query.where((builder) => {
        builder
          .where("title", "like", `%${search}%`)
          .orWhere("author", "like", `%${search}%`)
          .orWhere("genre", "like", `%${search}%`);
      });
    }
    if (genre) {
      query = query.where("genre", "like", `%${genre}%`);
    }
    if (sortBy && sortOrder) {
      query = query.orderBy(sortBy, sortOrder);
    }
    const books = await query;
    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
