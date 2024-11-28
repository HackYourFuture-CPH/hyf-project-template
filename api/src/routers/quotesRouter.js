import express from "express";
import { getQuotes } from "../controllers/quotesController.js";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getQuotes);

export default quotesRouter;
