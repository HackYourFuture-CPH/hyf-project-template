import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Message extends Model {}

Message.init(
  {
    senderId: {
      type: DataTypes.INTEGER,
      field: "sender_id",
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      field: "receiver_id",
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
