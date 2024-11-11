import express from "express";
import {
  addBookToUser,
  updateBookDetails,
  updateUserBook,
} from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();

userBooksRouter.post("/add", authenticate, addBookToUser);
userBooksRouter.put("/update-details", authenticate, updateBookDetails);
userBooksRouter.put("/update/:bookId", authenticate, updateUserBook);

export default userBooksRouter;
