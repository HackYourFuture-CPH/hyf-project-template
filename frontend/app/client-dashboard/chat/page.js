"use client";

import { getFieldFromCookie } from "@/app/utils/auth";
import { getAllClientsFromDeveloper } from "@/app/utils/chatUtil.js";
// import { getAllClientsFromDeveloper } from "@/app/utils/chatUtil";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [clients, setClients] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [roomName, setRoomName] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Format clients
  const formatClients = (clients) => {
    return clients.map((client) => ({
      name: client.client.name,
      id: client.clientId,
    }));
  };

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const userId = getFieldFromCookie("userId");
        if (userId) setSenderId(userId);

        const allClients = await getAllClientsFromDeveloper(
          userId
        );
        setClients(formatClients(allClients));
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newSocket = io(socketURL, { reconnection: true });
    setSocket(newSocket);

    // Socket events
    newSocket.on("receiveMessage", (message) => {
      setMessagesByRoom((prevMessages) => ({
        ...prevMessages,
        [message.roomName]: [
          ...(prevMessages[message.roomName] || []),
          message,
        ],
      }));
    });

    newSocket.on("chatHistory", (chatMessages) => {
      setMessagesByRoom((prevMessages) => ({
        ...prevMessages,
        [roomName]: chatMessages,
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join room
  const joinRoom = (specificRoomName = null) => {
    if (!specificRoomName && !receiverId) {
      alert("Please enter or select a receiver!");
      return;
    }

    if (!senderId) {
      alert("Sender ID is not available!");
      return;
    }

    const room =
      specificRoomName || `${receiverId}_${senderId}`;
    setRoomName(room);

    socket.emit("joinRoom", {
      senderId,
      receiverId,
      roomName: room,
    });
    socket.emit("fetchMessages", { roomName: room });
  };

  // Send message
  const sendMessage = () => {
    if (!roomName) {
      alert("Please join a room first!");
      return;
    }

    if (!messageInput.trim()) {
      alert("Please enter a message to send!");
      return;
    }

    const message = {
      senderId,
      receiverId,
      message: messageInput,
      roomName,
    };

    socket.emit("sendMessage", message);
    setMessagesByRoom((prevMessages) => ({
      ...prevMessages,
      [roomName]: [
        ...(prevMessages[roomName] || []),
        message,
      ],
    }));
    setMessageInput("");
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messagesByRoom, roomName]);

  return (
    <div className="flex h-full bg-gray-100 flex-col mx-auto max-w-screen-xl">
      <div className="flex flex-1 p-10 flex-col">
        <div className="flex flex-grow bg-white shadow-lg rounded-2xl">
          {/* Sidebar */}
          <div className="w-1/4 flex flex-col border-r-2 border-gray-100">
            <div className="p-4">
              <h2 className="text-xl font-bold text-primary-blue-dark">
                Chat App
              </h2>
            </div>

            <div className="p-4">
              <label
                htmlFor="receiverId"
                className="block font-medium mb-2"
              >
                Chat with:
              </label>
              <input
                type="number"
                id="receiverId"
                value={receiverId || ""}
                onChange={(e) =>
                  setReceiverId(e.target.value)
                }
                placeholder="Enter receiver ID"
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />
              <button
                onClick={() => joinRoom()}
                className="w-full bg-primary-blue-dark text-white py-2 rounded-lg hover:bg-primary-blue"
              >
                Start Chat
              </button>
            </div>

            {/* Chat Rooms List */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">
                Your Chats
              </h3>
              <ul className="space-y-2">
                {clients.map((client, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                    onClick={() =>
                      joinRoom(`${client.id}_${senderId}`)
                    }
                  >
                    Chat with{" "}
                    {client.name || `User ${client.id}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 flex items-center border-b-2 border-gray-100">
              <h3 className="text-lg font-semibold">
                Chat Room: {roomName || "No room joined"}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {(messagesByRoom[roomName] || []).map(
                (msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-3 rounded-lg max-w-md ${
                      msg.senderId === senderId
                        ? "bg-primary-purple text-white ml-auto"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <strong>
                      {msg.senderId === senderId
                        ? "You"
                        : `User ${msg.senderId}`}
                      :
                    </strong>{" "}
                    {msg.message}
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t-2 border-gray-100 flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) =>
                  setMessageInput(e.target.value)
                }
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 mr-2"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
