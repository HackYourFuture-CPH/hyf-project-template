import express from "express";
import { searchGoogleBooks } from "../controllers/searchGoogleBooksController.js";

const router = express.Router();
router.get("/", searchGoogleBooks);

export default router;
