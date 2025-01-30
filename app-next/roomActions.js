"use server";
import connection from "./lib/database_client";
import { cookies } from "next/headers";

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

export async function sendMessage(roomId, content) {
  try {
    const cookieStore = cookies();
    const userIdCookie = cookieStore.get("userId")?.value;
    const usernameCookie = cookieStore.get("username")?.value;

    if (!userIdCookie || !usernameCookie) {
      return { error: "User not authenticated." };
    }

    const userId = parseInt(userIdCookie, 10);

    const [message] = await connection("messages")
      .insert({
        room_id: roomId,
        user_id: userId,
        content,
      })
      .returning("*");

    return { ...message, sender: usernameCookie };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: error.message };
  }
}

export async function getMessages(roomId, sinceTimestamp = null) {
  try {
    let query = connection("messages")
      .select(
        "messages.id",
        "messages.room_id",
        "messages.user_id",
        "messages.content",
        "messages.timestamp",
        "user.username"
      )
      .join("user", "messages.user_id", "=", "user.id")
      .where({ "messages.room_id": roomId })
      .orderBy("messages.timestamp", "asc");

    if (sinceTimestamp) {
      query = query.where("messages.timestamp", ">", new Date(sinceTimestamp));
    }

    const messages = await query;
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}
