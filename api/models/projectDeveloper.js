import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

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
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["developer_id"] },
    },
    underscored: true,
  }
);
ProjectDeveloper.belongsTo(User, {
  foreignKey: "developer_id",
  as: "Developer",
});

export default ProjectDeveloper;
