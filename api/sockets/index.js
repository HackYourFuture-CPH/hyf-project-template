import { Server } from "socket.io";
import chatSocket from "./chatSocket.js";

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Handle namespaces or global connections here
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Initialize chat-related socket events
    chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default setupSockets;
