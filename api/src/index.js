import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
