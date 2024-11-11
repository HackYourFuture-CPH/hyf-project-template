import express from "express";
import {
  addBookToUser,
  updateBookDetails,
} from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();

userBooksRouter.post("/add", authenticate, addBookToUser);
userBooksRouter.put("/update-details", authenticate, updateBookDetails);
export default userBooksRouter;
