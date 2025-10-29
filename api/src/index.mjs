import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// This is an example of how to set up a route. Replace it with your own.
apiRouter.get("/", async (req, res) => {
  // Here is an example of making a query to the database you set up:
  const query = "SELECT 'Hello, world!' AS message;";
  const result = await knex.raw(query);
  res.json(result);
});

// Here is an example of optionally setting up nested routes. Replace it or delete as needed.
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);
app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
