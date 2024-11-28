import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
} from "../controllers/booksController.js";

const booksRouter = express.Router();

booksRouter.get("/", getBooks);
booksRouter.get("/search", searchBooks);
booksRouter.get("/:id", getBookById);
booksRouter.post("/", addBook);
booksRouter.put("/:id", updateBook);
booksRouter.delete("/:id", deleteBook);

export default booksRouter;
