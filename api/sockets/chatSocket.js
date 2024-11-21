import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const chatSocket = (io, socket) => {
  // Join or create a room
  socket.on("joinRoom", async ({ senderId, receiverId }) => {
    const participantIds = [senderId, receiverId].sort().join("_");

    let conversation = await Conversation.findOne({
      where: { participantIds },
    });
    if (!conversation) {
      conversation = await Conversation.create({ participantIds });
    }

    socket.join(conversation.id);
    console.log(`User joined conversation: ${conversation.id}`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const participantIds = [senderId, receiverId].sort().join("_");
    const conversation = await Conversation.findOne({
      where: { participantIds },
    });

    if (!conversation) {
      console.error("Conversation not found");
      return;
    }

    const newMessage = await Message.create({
      conversationId: conversation.id,
      senderId,
      receiverId,
      message,
    });

    io.to(conversation.id).emit("receiveMessage", newMessage);
  });

  // Fetch messages
  socket.on("fetchMessages", async ({ senderId, receiverId }) => {
    const participantIds = [senderId, receiverId].sort().join("_");
    const conversation = await Conversation.findOne({
      where: { participantIds },
    });

    if (!conversation) {
      socket.emit("chatHistory", []);
      return;
    }

    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [["createdAt", "ASC"]],
    });

    socket.emit("chatHistory", messages);
  });
};

export default chatSocket;
