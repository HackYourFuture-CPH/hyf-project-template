import express from "express";
import { getQuotes, addQuote } from "../controllers/quotesController.js";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getQuotes);
quotesRouter.post("/add-quote", addQuote);

export default quotesRouter;
