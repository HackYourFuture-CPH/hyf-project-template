import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Message extends Model {}

Message.init(
  {
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "messages",
    timestamps: true,
  }
);

export default Message;
