"use server";
import connection from "./lib/database_client";

export async function createRoom(videoUrl) {
  try {
    const [room] = await connection("room")
      .insert({
        video_url: videoUrl,
      })
      .returning("*");
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
}

export async function getRoom(roomId) {
  try {
    const room = await connection("room").where({ id: roomId }).first();
    return room;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }
}

export async function sendMessage(roomId, userId, content) {
  try {
    await connection("messages").insert({
      room_id: roomId,
      user_id: userId,
      content,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

export async function getMessages(roomId) {
  try {
    const messages = await connection("messages")
      .where({ room_id: roomId })
      .orderBy("timestamp", "asc");
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}
