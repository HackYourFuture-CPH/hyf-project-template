"use client"
import { useEffect, useState } from "react";
import api from "@/utils/api";

// This page can be deleted once you add your own page
function TestPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMessage() {
      const response = await fetch(api("/nested"));
      const { message } = await response.json();
      setMessage(message);
    }

    fetchMessage();
  }, []);

  return <span className="message">{message}</span>;
}

export default TestPage;
