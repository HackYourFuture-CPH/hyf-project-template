"use client";

import { useState } from "react";
import styles from "./AIModifier.module.css";
import Button from "../Button/Button";

export default function AIModifier({ onModify, isLoading }) {
  const [command, setCommand] = useState("");

  const handleModifyClick = () => {
    if (!command.trim()) return;
    onModify(command);
    setCommand("");
  };

  return (
    <div className={styles.aiModifier}>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="e.g., 'add a coffee break on day 1 morning'"
        disabled={isLoading}
      />
      <Button onClick={handleModifyClick} disabled={isLoading}>
        {isLoading ? "Updating..." : "Modify with AI"}
      </Button>
    </div>
  );
}
