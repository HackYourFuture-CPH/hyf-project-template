import express from "express";
//import { authenticate } from "../middlewares/authenticate.js";
import {
  getQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/bookQuotesController.js";

const bookQuotesRouter = express.Router();
//bookQuotesRouter.use(authenticate());

bookQuotesRouter.get("/", getQuotes);
bookQuotesRouter.post("/add-quotes", addQuote);
bookQuotesRouter.put("/:id", updateQuote);
bookQuotesRouter.delete("/:id", deleteQuote);

export default bookQuotesRouter;
