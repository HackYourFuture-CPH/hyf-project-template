import express from "express";

import ChatController from "../../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/history/:userId/:receiverId", ChatController.getChatMessages);

chatRouter.post("/send", ChatController.sendChatMessages);

export default chatRouter;
