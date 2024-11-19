import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.js";
import ProjectModel from "./projects.js";

class ProjectDeveloper extends Model {}

ProjectDeveloper.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      field: "project_id",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
    developerId: {
      type: DataTypes.INTEGER,
      field: "developer_id",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    assignedDate: {
      type: DataTypes.DATE,
      field: "assigned_date",
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
      attributes: { exclude: ["developer_id", "developerId", "projectId"] },

      include: [
        {
          model: ProjectModel,
          as: "projects",
        },
      ],
    },
    underscored: true,
  }
);
ProjectDeveloper.belongsTo(UserModel, {
  foreignKey: "developer_id",
  as: "Developer",
});
ProjectDeveloper.belongsTo(ProjectModel, {
  foreignKey: "project_id",
  as: "projects",
});

export default ProjectDeveloper;
