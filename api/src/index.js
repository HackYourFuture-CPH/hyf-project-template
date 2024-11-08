import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import connection from "./database_client.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  try {
    const books = await knex("Books").select("*");
    res.json({ books });
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ message: "Error fetching data from database" });
  }
});

async function testTableExistence() {
  try {
    const tables = await connection.raw("SHOW TABLES;");
    console.log(
      "Tables in database:",
      tables[0].map((row) => Object.values(row)[0])
    );
  } catch (error) {
    console.error("Error checking tables:", error);
  } finally {
    connection.destroy(); // Close the connection after the test
  }
}

// Call the test function to check tables
testTableExistence();

// This nested router example can also be replaced with your own sub-router
// apiRouter.use("/nested", nestedRouter);

app.use("/api/books", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
