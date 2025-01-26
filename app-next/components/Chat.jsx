"use client";
import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    setMessages([...messages, { text: inputMessage, sender: "You" }]);
    setInputMessage("");
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
              <strong className="text-blue-400">{message.sender}:</strong>{" "}
              {message.text}
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
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
