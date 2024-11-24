import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end",
    },
    allDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "all_day",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    modelName: "Events",
    tableName: "events",
    timestamps: false,
  }
);

export default Events;
