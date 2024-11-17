import Message from "../models/message.js";

class ChatService {
  static async getChatMessages(data) {
    try {
      const getMessages = await Message.findAll(data);
      return getMessages;
    } catch (error) {
      throw new Error("Error fetching chat history: " + error.message);
    }
  }

  static async sendChatMessages(data) {
    try {
      const sendMessages = await Message.create(data);
      return sendMessages;
    } catch (error) {
      throw new Error("Error sending messages: " + error.message);
    }
  }
}

export default ChatService;
