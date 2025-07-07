import knex from "knex";

const connection = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    filename: process.env.DB_SQLITE_FILENAME, // For SQLite
    ssl:
      process.env.DB_USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
  useNullAsDefault: process.env.DB_USE_NULL_AS_DEFAULT === "true", // For SQLite
});

export default connection;
