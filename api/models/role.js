import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    roleName: {
      type: DataTypes.STRING(50),
      field: "role_name",
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

Role.associate = (models) => {
  Role.hasMany(models.User, { foreignKey: "role_id", as: "users" });
};

export default Role;
