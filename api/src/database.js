import pkg from "pg";
import dotenv from "dotenv";
dotenv.config(); // load environment variables

const { Pool } = pkg;

// Configures the database connection
const pool = new Pool({
  user: "postgres", // your Postgres username
  host: "localhost", // or remote host if deployed
  database: "careconnect", // your database name
  password: process.env.DB_PASSWORD, // your Postgres password (set in environment variable)
  port: 5432, // default Postgres port
});

export default pool;
