"use client";

import { useState } from "react";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function ChatWindow({
  messages = [],
  onSendMessage,
  isLoading,
}) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className={styles.sidebarModule}>
      <h3>Trip Chat</h3>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.first_name}:</b> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" variant="secondary" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
