import express from "express";
import {
  searchGoogleBooks,
  addBookToUser,
} from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();
userBooksRouter.get("/search", searchGoogleBooks);

userBooksRouter.post("/add", authenticate, addBookToUser);

export default userBooksRouter;
