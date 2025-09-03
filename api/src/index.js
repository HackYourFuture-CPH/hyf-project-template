import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import { PrismaClient } from "./generated/prisma/index.js";

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
export const prisma = new PrismaClient();

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
