import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_API_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.use("/", authRouter);

app.use("/api", apiRouter);

//middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.status == 404) {
    res.status(404).json({ message: err.message });
  }
  res.status(500).json({ message: "An unexpected error occurred!" });
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
