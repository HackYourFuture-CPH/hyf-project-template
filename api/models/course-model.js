import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user-model.js";

const Course = sequelize.define(
  "Course",
  {
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
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  },
  {
    tableName: "Courses",
  }
);

Course.belongsTo(User, { as: "instructor", foreignKey: "instructorId" });
User.hasMany(Course, { as: "courses", foreignKey: "instructorId" });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Course model is synchronized.");
  })
  .catch((err) => {
    console.error("Error syncing the Course model:", err);
  });

export default Course;
