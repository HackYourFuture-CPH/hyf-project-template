import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import User from "./user-model.js";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User", // Reference the User table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.NOW,
  },
});

Course.belongsTo(User, { as: "instructor", foreignKey: "instructorId" });
User.hasMany(Course, { as: "courses", foreignKey: "instructorId" });

export default Course;
