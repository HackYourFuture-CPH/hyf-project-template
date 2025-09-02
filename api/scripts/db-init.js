import pg from "pg";
const { Client } = pg;
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

// The user defined here is automatically a superuser inside the container.
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
};

const schemaFile = path.join(__dirname, "../../database/schema/schema.sql");
const mockDataFile = path.join(__dirname, "../../database/seeds/mock_data.sql");

async function setupDatabase() {
  // Give the container a moment to initialize fully on the first run
  console.log("Waiting for the database container to be ready...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Connect directly to the application database as the application user.
  const client = new Client(dbConfig);

  try {
    console.log("--- Database Setup Started ---");
    await client.connect();

    console.log(`[1/2] Applying schema to "${dbConfig.database}"...`);
    const schemaSql = await fs.readFile(schemaFile, "utf8");
    await client.query(schemaSql);

    console.log(`[2/2] Seeding data into "${dbConfig.database}"...`);
    const mockDataSql = await fs.readFile(mockDataFile, "utf8");
    await client.query(mockDataSql);

    console.log("--- ✅ Database Setup Complete ---");
  } catch (err) {
    console.error("!-> Error during database setup:", err);
    throw err;
  } finally {
    await client.end();
  }
}

setupDatabase().catch(() => process.exit(1));
