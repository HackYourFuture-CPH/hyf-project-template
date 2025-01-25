import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user-models.js";
import Course from "./course-model.js";

const Enrollment = sequelize.define("Enrollment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User", // Reference the User table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Course", // Reference the Course table
      key: "id",
    },
    onDelete: "CASCADE",
  },
  progress: {
    type: DataTypes.ARRAY, 
    allowNull: false,
    defaultValue: 0,
  },
  enrolledAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.NOW,
  },
});

User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });
