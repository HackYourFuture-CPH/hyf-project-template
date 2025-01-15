import express from "express";
import knex from "../database_client.js";

const questionRouter = express.Router();

// Fetch all questions
questionRouter.get("/", async (req, res, next) => {
  try {
    const questions = await knex("questions").select("*");
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// Fetch a question by ID
questionRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await knex("questions").where({ id }).first();
    if (!question) {
      return res
        .status(404)
        .json({ message: `Question with ID ${id} not found` });
    }
    res.json(question);
  } catch (err) {
    next(err);
  }
});

// Create a new question
questionRouter.post("/", async (req, res, next) => {
  try {
    const { question, answers, correctAnswer } = req.body;
    if (!question || !answers || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuestion = await knex("questions").insert({
      question,
      answers: JSON.stringify(answers),
      correctAnswer,
    });
    res
      .status(201)
      .json({ message: "Question created successfully", id: newQuestion[0] });
  } catch (err) {
    next(err);
  }
});

// Update a question by ID
questionRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answers, correctAnswer } = req.body;
    if (!question || !answers || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await knex("questions")
      .where({ id })
      .update({
        question,
        answers: JSON.stringify(answers),
        correctAnswer,
      });

    if (!updated) {
      return res
        .status(404)
        .json({ message: `Question with ID ${id} not found` });
    }
    res.json({ message: "Question updated successfully" });
  } catch (err) {
    next(err);
  }
});

// Delete a question by ID
questionRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await knex("questions").where({ id }).del();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: `Question with ID ${id} not found` });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default questionRouter;
