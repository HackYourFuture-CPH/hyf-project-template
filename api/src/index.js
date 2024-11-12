import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nestedRouter from "./routers/nested.js";
import userRouter from "./routers/userRoutes.js";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";

import devRouter from "./routers/developerRouter.js";
import projectRouter from "./routers/projectRouter.js";

import swaggerController from "../controllers/swaggerController.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.use("/", authRouter);
apiRouter.use("/", userRouter);
apiRouter.use("/nested", nestedRouter);
apiRouter.use("/dev", devRouter);
apiRouter.use("/pj", projectRouter);

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello, this API works" });
});

app.use("/docs", swaggerController);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
