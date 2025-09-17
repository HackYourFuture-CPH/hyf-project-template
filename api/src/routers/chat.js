import express from "express";
import knex from "../db.mjs";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);

// GET all messages for a trip
router.get("/", async (req, res) => {
  const { tripId } = req.params;
  try {
    const messages = await knex("trip_chat_messages as tcm")
      .join("users as u", "tcm.user_id", "u.id")
      .select("tcm.id", "tcm.content", "tcm.created_at", "u.first_name")
      .where("tcm.trip_id", tripId)
      .orderBy("tcm.created_at", "asc");
    res.json({ data: messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  const { tripId } = req.params;
  const { content } = req.body;
  const userId = req.user.id || req.user.sub;

  if (!content) {
    return res.status(400).json({ error: "Message content is required." });
  }
  try {
    const [newMessage] = await knex("trip_chat_messages")
      .insert({ trip_id: tripId, user_id: userId, content })
      .returning("id");
    res.status(201).json({ message: "Message posted.", data: newMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to post message." });
  }
});

export default router;
