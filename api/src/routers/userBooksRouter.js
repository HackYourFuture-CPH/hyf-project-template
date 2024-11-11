import express from "express";
import { addBookToUser } from "../controllers/userBooksController.js";
import { authenticate } from "../middlewares/authenticate.js";

const userBooksRouter = express.Router();

userBooksRouter.post("/add", authenticate, addBookToUser);

export default userBooksRouter;
