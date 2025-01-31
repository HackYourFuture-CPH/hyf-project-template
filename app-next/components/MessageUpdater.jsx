"use client";
import { useEffect, useState } from "react";
import { getMessages } from "@/roomActions";

const MessageUpdater = ({ roomId, onUpdate, initialMessages }) => {
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);

  if (initialMessages.length > 0 && !lastMessageTimestamp) {
    const latestTimestamp = Math.max(
      ...initialMessages.map((msg) => new Date(msg.timestamp))
    );
    setLastMessageTimestamp(latestTimestamp);
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const newMessages = await getMessages(roomId, lastMessageTimestamp);
        if (onUpdate && newMessages.length > 0) {
          const filteredNewMessages = newMessages.filter(
            (msg) =>
              new Date(msg.timestamp) > (lastMessageTimestamp || new Date(0))
          );

          if (filteredNewMessages.length > 0) {
            onUpdate(filteredNewMessages);

            setLastMessageTimestamp(
              new Date(
                Math.max(
                  ...filteredNewMessages.map((msg) => new Date(msg.timestamp)),
                  ...(lastMessageTimestamp ? [lastMessageTimestamp] : [])
                )
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const intervalId = setInterval(fetchMessages, 3000);

    fetchMessages();

    return () => clearInterval(intervalId);
  }, [roomId, onUpdate, lastMessageTimestamp]);

  return null;
};
export default MessageUpdater;
