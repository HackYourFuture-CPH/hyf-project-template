import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import nestedRouter from "./routers/nested.js";
import userRouter from "./routers/userRoutes.js";
import authRouter from "./routers/authRouter.js";
import devRouter from "./routers/developerRouter.js";
import projectRouter from "./routers/projectRouter.js";
import roleRouter from "./routers/roleRouter.js";
import swaggerController from "../controllers/swaggerController.js";
import chatRoutes from "./routers/chatRouter.js";
import Message from "../models/message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

const apiRouter = express.Router();

apiRouter.use("/", authRouter);
apiRouter.use("/", userRouter);
apiRouter.use("/", roleRouter);
apiRouter.use("/nested", nestedRouter);
apiRouter.use("/dev", devRouter);
apiRouter.use("/pj", projectRouter);

app.use("/api", apiRouter);
app.use("/api/chat", chatRoutes);

app.use("/docs", swaggerController);

app.get("/", (req, res) => {
  res.json({ message: "Hello, this API works" });
});

io.on("connection", (socket) => {
  console.log("A user connected to the chat");

  socket.on("disconnect", () => {
    console.log("User disconnected from chat");
  });

  socket.on("message", async (msg) => {
    try {
      const message = await Message.create({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.text,
        timestamp: new Date(),
      });

      io.emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
