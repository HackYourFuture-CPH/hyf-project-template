import express from "express";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
  filterBooks,
  sortBooks,
} from "../controllers/booksController.js";

const booksRouter = express.Router();

booksRouter.get("/", getBooks);
booksRouter.get("/:id", getBookById);
booksRouter.post("/", addBook);
booksRouter.put("/:id", updateBook);
booksRouter.delete("/:id", deleteBook);
booksRouter.get("/search", searchBooks);
booksRouter.get("/filter", filterBooks);
booksRouter.get("/sort", sortBooks);

export default booksRouter;
