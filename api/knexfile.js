import "dotenv/config";

const config = {
  client: process.env.DB_CLIENT || "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:
      process.env.DB_USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: "./src/migrations",
  },
  seeds: {
    directory: "./src/seeds",
  },
};

export default config;
