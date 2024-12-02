import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getQuotes,
  addQuote,
  getUserQuotes,
  deleteQuote,
} from "../controllers/quotesController.js";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getQuotes);
quotesRouter.post("/add-quote", addQuote);
quotesRouter.get("/user/:userId", authenticate(), getUserQuotes);
quotesRouter.delete("/:quoteId", authenticate(), deleteQuote);

export default quotesRouter;
