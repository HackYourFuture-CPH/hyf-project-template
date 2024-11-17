import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Conversation from "./conversation.js";
class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      field: "conversation_id",
      allowNull: false,
      references: {
        model: Conversation,
        key: "id",
      },
    },
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

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

export default Message;
