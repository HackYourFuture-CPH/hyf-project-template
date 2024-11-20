import express from "express";
import {
  addNotes,
  getNotes,
  deleteNotes,
  updateNotes,
} from "../controllers/notesController.js";

const notesRouter = express.Router();

notesRouter.get("/notes", getNotes);
notesRouter.post("/notes", addNotes);
notesRouter.put("/notes/:id", updateNotes);
notesRouter.delete("/notes/:id", deleteNotes);

export default notesRouter;
