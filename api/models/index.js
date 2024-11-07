"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;

// Database connection setup
if (config.use_env_variable) {
  // Using environment variable for database connection string
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Using configuration directly from config.json for PostgreSQL
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Test the connection (optional, but recommended for error handling)
sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Connection to the database (${config.database}) has been established successfully.`
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Read all files in the current directory (models) and dynamically import them
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Exclude hidden files like . or _ files
      file !== basename && // Exclude the index.js file itself
      file.slice(-3) === ".js" && // Only .js files
      file.indexOf(".test.js") === -1 // Exclude test files
    );
  })
  .forEach((file) => {
    // Dynamically import each model and initialize it with Sequelize and DataTypes
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Setup associations (many-to-many, one-to-many, etc.)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize instance and Sequelize class for easier access
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sync the models (optional, for development only, use migrations in production)
sequelize
  .sync({ force: false }) // force: false means not dropping tables
  .then(() => {
    console.log("Database & tables have been synchronized.");
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });

module.exports = db;
