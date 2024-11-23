// models/Role.js
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import originalUser from "./originalUser.js";

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      field: "client_id",
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "in-progress"),
      allowNull: false,
      defaultValue: "pending",
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      field: "start_date",
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      field: "end_date",
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    schema: "public",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["client_id"] },
      include: [
        {
          model: originalUser,
          as: "client",
          attributes: ["name"],
        },
      ],
    },
    underscored: true,
  }
);
Project.belongsTo(originalUser, { foreignKey: "client_id", as: "client" });

export default Project;
