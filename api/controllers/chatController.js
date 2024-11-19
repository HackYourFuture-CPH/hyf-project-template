import ChatService from "../services/chatService.js";
import { Sequelize } from "sequelize";

class ChatController {
  static async getChatMessages(req, res) {
    const { userId, receiverId } = req.params;
    try {
      const getChats = await ChatService.getChatMessages({
        where: {
          [Sequelize.Op.or]: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        order: [["timestamp", "ASC"]],
      });
      res.status(200).json(getChats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendChatMessages(req, res) {
    const { conversationId, senderId, receiverId, message } = req.body;
    try {
      const sendChats = await ChatService.sendChatMessages({
        conversationId,
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      });
      res.status(200).json(sendChats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
export default ChatController;
