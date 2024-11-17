import ChatService from "../services/chatService.js";
import { Sequelize } from "sequelize";

class ChatController {
  static async getChatMessages(req, res) {
    const { user_id, receiver_id } = req.params;
    try {
      const getChats = await ChatService.getChatMessages({
        where: {
          [Sequelize.Op.or]: [
            { sender_id: user_id, receiver_id },
            { sender_id: receiver_id, receiver_id: user_id },
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
    const { sender_id, receiver_id, message } = req.body;
    try {
      const sendChats = await ChatService.sendChatMessages({
        sender_id,
        receiver_id,
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
