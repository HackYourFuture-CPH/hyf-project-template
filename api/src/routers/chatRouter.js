import express from "express";
import Message from "../../models/message.js";
import sequelize from "../../config/db.js";

const router = express.Router();

// Route to fetch chat history between two users
router.get("/history/:userId/:receiverId", async (req, res) => {
  const { user_id, receiver_id } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [sequelize.Op.or]: [
          { sender_id: user_id, receiver_id },
          { sender_id: receiver_id, receiverId: user_id },
        ],
      },
      order: [["timestamp", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).send("Server error");
  }
});

// Route to send a message (if using HTTP POST for messaging)
router.post("/send", async (req, res) => {
  const { sender_id, receiver_id, text } = req.body;

  try {
    const message = await Message.create({
      sender_id,
      receiver_id,
      message: text,
      timestamp: new Date(),
    });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Server error");
  }
});

export default router;
