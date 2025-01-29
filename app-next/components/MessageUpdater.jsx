"use client";
import { useEffect } from "react";
import { getMessages } from "@/roomActions";

const MessageUpdater = ({ roomId, onUpdate }) => {
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const newMessages = await getMessages(roomId);
        if (onUpdate) {
          onUpdate(newMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const intervalId = setInterval(fetchMessages, 1000);

    fetchMessages();

    return () => clearInterval(intervalId);
  }, [roomId, onUpdate]);

  return null;
};

export default MessageUpdater;
