import express from "express";
import {
    addBookToUser,
    updateBookDetails,
    updateUserBook,
    deleteUserBook,
    getUserBooks,
    getFavoriteGenreAndAuthor,
    toggleFavorite,
    getTopBooks,
} from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();

userBooksRouter.post("/add", authenticate(), addBookToUser);
userBooksRouter.get("/list", authenticate(), getUserBooks);
userBooksRouter.put("/update-details", authenticate(), updateBookDetails);
userBooksRouter.put("/update/:bookId", authenticate(), updateUserBook);
userBooksRouter.delete("/delete/:bookId", authenticate(), deleteUserBook);
userBooksRouter.get("/favorite-data", authenticate(), getFavoriteGenreAndAuthor);
userBooksRouter.put("/favorite/:bookId", authenticate(), toggleFavorite);
userBooksRouter.get("/top-books", getTopBooks);

export default userBooksRouter;
