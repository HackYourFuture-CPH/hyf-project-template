"use client";
import React, { useState } from "react";
import { sendMessage } from "@/roomActions";

const Chat = ({ initialMessages, roomId }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    try {
      const userId = 5;
      await sendMessage(roomId, userId, inputMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: inputMessage, sender: "You" },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container bg-gray-900 text-gray-300 p-4 rounded-lg shadow-md flex flex-col space-y-4 h-80">
      <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-700 pb-2">
        Live Chat
      </h2>
      <div className="messages flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
            >
              <strong className="text-blue-400">User:</strong> {message.content}
              <span className="text-gray-500 text-sm ml-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            No messages yet. Start the chat!
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 p-2 bg-gray-800 text-gray-200 rounded-lg outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
