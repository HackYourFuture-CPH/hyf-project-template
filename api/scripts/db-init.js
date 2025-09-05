import pg from "pg";
const { Client } = pg;
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const appDbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const schemaFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../database/schema/schema.sql"
);
const mockDataFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../database/seeds/mock_data.sql"
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function setupDatabase() {
  console.log("Waiting for the database container to be ready...");
  await wait(5000);
  console.log("--- Database Setup Started ---");

  const appClient = new Client(appDbConfig);
  try {
    await appClient.connect();
    console.log("[1/2] Applying schema...");
    const schemaSql = await fs.readFile(schemaFile, "utf8");
    await appClient.query(schemaSql);
    console.log("[2/2] Seeding data...");
    const mockDataSql = await fs.readFile(mockDataFile, "utf8");
    await appClient.query(mockDataSql);
    console.log("--- ✅ Database Setup Complete ---");
  } catch (err) {
    console.error("!-> Error during schema/seed application:", err);
    throw err;
  } finally {
    await appClient.end();
  }
}

setupDatabase().catch((e) => {
  console.error("!-> A critical error occurred during database setup.");
  process.exit(1);
});
