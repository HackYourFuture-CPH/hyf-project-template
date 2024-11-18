import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Conversation = sequelize.define(
  "conversations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    participantIds: {
      type: DataTypes.STRING,
      field: "participant_ids",
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Conversation;
