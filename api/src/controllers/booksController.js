import knex from "../database_client.js";

export const getBooks = async (req, res) => {
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
  try {
    const { title, author, genre, cover_image, description, google_books_id } =
      req.body;
    if (!title || !author || !genre) {
      return res
        .status(400)
        .json({ error: "Title, author, and genre are required" });
    }
    const [newBookId] = await knex("Books").insert({
      title,
      author,
      genre,
      cover_image,
      description,
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
  const { book_id } = req.params;
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
    const updatedRows = await knex("Books").where({ book_id }).update({
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
    const updatedBook = await knex("Books").where({ book_id }).first();
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
  const { query } = req.query;
  try {
    const books = await knex("Books")
      .where("title", "like", `%${query}%`)
      .orWhere("author", "like", `%${query}%`)
      .orWhere("genre", "like", `%${query}%`);
    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const filterBooks = async (req, res) => {
  const { genre } = req.query;
  try {
    const books = await knex("Books").where({ genre });
    res.json(books);
  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sortBooks = async (req, res) => {
  const { sortBy } = req.query;
  try {
    const books = await knex("Books").orderBy(sortBy);
    res.json(books);
  } catch (error) {
    console.error("Error sorting books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
