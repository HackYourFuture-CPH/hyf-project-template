import knex from "knex";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  client: process.env.DB_CLIENT || "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    ssl:
      process.env.DB_USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: join(__dirname, "src/migrations"),
    extension: "js",
  },
  seeds: {
    directory: join(__dirname, "src/seeds"),
    extension: "js",
  },
};

export default config;
