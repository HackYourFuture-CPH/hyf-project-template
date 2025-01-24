import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Course from "./course-model.js";

const Lecture = sequelize.define(
  "Lecture",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoKey: {
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
    tableName: "Lectures",
  }
);

Lecture.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Lecture, { as: "lectures", foreignKey: "courseId" });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Lecture model is synchronized.");
  })
  .catch((err) => {
    console.error("Error syncing the Lecture model:", err);
  });

export default Lecture;
