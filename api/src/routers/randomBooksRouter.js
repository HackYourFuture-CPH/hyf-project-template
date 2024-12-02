import express from "express";
import { fetchRandomBooks } from "../controllers/randomBooksController.js";

const randomBooksRouter = express.Router();

randomBooksRouter.get("/", fetchRandomBooks);

export default randomBooksRouter;
