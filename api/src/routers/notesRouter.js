import express from "express";
import {
  addNotes,
  getNotes,
  deleteNotes,
  updateNotes,
} from "../controllers/notesController.js";

const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.post("/add-notes", addNotes);
notesRouter.put("/:id", updateNotes);
notesRouter.delete("/:id", deleteNotes);

export default notesRouter;
