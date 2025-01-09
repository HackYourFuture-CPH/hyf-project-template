import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

app.get("/api", async (req, res) => {
  res.json("Welcome to upskill");
});

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
