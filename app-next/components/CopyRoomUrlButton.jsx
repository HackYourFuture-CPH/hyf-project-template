"use client";
import React, { useState, useEffect } from "react";

const CopyRoomUrlButton = ({ roomId }) => {
  const [roomUrl, setRoomUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRoomUrl(`${window.location.origin}/room/${roomId}`);
  }, [roomId]);

  const copyRoomUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room URL: ", err);
      alert("Failed to copy room URL. Please try again.");
    }
  };

  return (
    <button
      onClick={() => copyRoomUrl(roomUrl)}
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
      disabled={!roomUrl}
    >
      {copied ? "Successfully Copied" : "Copy Room URL"}
    </button>
  );
};

export default CopyRoomUrlButton;
