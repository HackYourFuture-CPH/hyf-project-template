"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // 1. Import useParams
import styles from "./InviteMembers.module.css";
import Button from "../Button/Button";

export default function InviteMembers() {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams(); // 2. Get the current tripId from the URL

  const handleCopyLink = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/invitations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to create invite link.");

      const result = await response.json();
      const { shareableLink } = result;

      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to create invite link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.inviteModule}>
      <h3>Invite Friends</h3>
      <Button onClick={handleCopyLink} disabled={isLoading}>
        {isLoading
          ? "Generating..."
          : isCopied
          ? "✅ Copied!"
          : "🔗 Copy Invite Link"}
      </Button>
    </div>
  );
}
