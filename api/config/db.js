import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_DATABASE_NAME",
  "DB_CLIENT",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1); // Exit the process if any required variable is missing
  }
});

// Debugging: Check if environment variables are loaded correctly
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_PORT:", process.env.DB_PORT);
// console.log("DB_DATABASE_NAME:", process.env.DB_DATABASE_NAME);

// Set up Sequelize configuration based on environment variables
const sequelizeOptions = {
  dialect: process.env.DB_CLIENT, // 'pg' (PostgreSQL)
  logging: false, // Disable logging for cleaner output
};

// If SSL is enabled, configure Sequelize to use SSL
if (process.env.DB_USE_SSL === "true") {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true, // Enable SSL
      rejectUnauthorized: false, // In some cases, you may want to bypass SSL certificate verification
    },
  };
}

// Set up a Sequelize instance with PostgreSQL connection details
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE_NAME}`,
  sequelizeOptions
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
