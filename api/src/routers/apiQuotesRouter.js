import express from "express";
import { fetchQuote } from "../controllers/apiQuotesController.js";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", fetchQuote);

export default quotesRouter;
