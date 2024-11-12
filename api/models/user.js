import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./role.js";

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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["role_id"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["role_name"],
        },
      ],
    },
  }
);

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

User.addHook("afterFind", (users) => {
  if (!users) return users;

  const transform = (user) => {
    if (user.role) {
      user.role_name = user.role.role_name;
      delete user.role;
    }
    return user;
  };

  return Array.isArray(users) ? users.map(transform) : transform(users);
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("User model has been synchronized.");
  })
  .catch((err) => {
    console.error("Error syncing the model:", err);
  });

export default User;
