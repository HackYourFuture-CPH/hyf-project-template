import express from "express";
import Message from "../../models/message.js";
import sequelize from "../../config/db.js";

const router = express.Router();

// Route to fetch chat history between two users
router.get("/history/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;

  try {
    const messages = await Message.findAll({
      where: {
        [sequelize.Op.or]: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
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
  const { senderId, receiverId, text } = req.body;

  try {
    const message = await Message.create({
      senderId,
      receiverId,
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
