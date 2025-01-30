"use client";
import React, { useEffect, useRef } from "react";

const AutoScroll = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return <div ref={messagesEndRef}></div>;
};

export default AutoScroll;
