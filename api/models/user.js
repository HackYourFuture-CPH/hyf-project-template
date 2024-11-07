// models/user.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Import the Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  },
  {
    tableName: "users", // Explicitly specify table name
    timestamps: false, // Disable Sequelize's automatic timestamp handling
  }
);

// Sync the model with the database (you can call this manually or use migrations)
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("User model has been synchronized.");
  })
  .catch((err) => {
    console.error("Error syncing the model:", err);
  });

export default User;
