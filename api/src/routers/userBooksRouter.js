import express from "express";
import {
  addBookToUser,
  updateBookDetails,
  updateUserBook,
  deleteUserBook,
} from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();

userBooksRouter.post("/add", authenticate, addBookToUser);
userBooksRouter.put("/update-details", authenticate, updateBookDetails);
userBooksRouter.put("/update/:bookId", authenticate, updateUserBook);
userBooksRouter.delete("/delete/:bookId", authenticate, deleteUserBook);

export default userBooksRouter;
