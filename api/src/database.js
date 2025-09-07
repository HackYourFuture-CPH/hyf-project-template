import pkg from "pg"; // pkg means package and is used to import the pg module
import dotenv from "dotenv";
dotenv.config(); // used to load environment variables

const { Pool } = pkg;

// code below configures the database connection
const pool = new Pool({
  user: "postgres", // your Postgres username
  host: "localhost", // or remote host if deployed
  database: "postgres", // your database name
  password: "daraz12345", // your Postgres password (set in environment variable)
  port: 5432, // default Postgres port
});

export default pool;
