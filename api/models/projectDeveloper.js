import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class ProjectDeveloper extends Model {}

ProjectDeveloper.init(
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
    developer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    assigned_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectDeveloper",
    tableName: "project_developers",
    schema: "public",
    timestamps: false, // No auto-generated timestamps as it's a join table
    underscored: true, // Use snake_case column names
  }
);

export default ProjectDeveloper;
