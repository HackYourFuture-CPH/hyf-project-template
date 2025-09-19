"use client";

import { useState } from "react";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function PreferenceCollector({ onGetSuggestions, isLoading }) {
  const [preferences, setPreferences] = useState("");

  const handleClick = () => {
    onGetSuggestions(preferences);
  };

  return (
    <div className={styles.sidebarModule}>
      <h3>Your Preferences</h3>
      <textarea
        className={styles.textarea}
        placeholder="e.g., 'I love art museums, history, and great food.'"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Getting Suggestions..." : "Get AI Suggestions"}
      </Button>
    </div>
  );
}
