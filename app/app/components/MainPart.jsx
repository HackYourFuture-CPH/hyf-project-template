"use client"; // Important to mark this as a Client Component
import React from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import styles from "./MainPart.module.css";
import Button from "./Button";

const MainPart = () => {
  const router = useRouter(); // Initialize the router from next/navigation

  // Function to handle navigation to the login page
  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <main className={styles.mainPart}>
      <h1 className={styles.mainTitle}>
        Welcome to Leaf Notes Your personal space to track, cherish, and explore
        your reading journey.
      </h1>
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>
          With Leaf Notes, you can organize your reading history, jot down your
          thoughts, and set reading goals—all in one place.
        </p>
        <div className={styles.buttonContainer}>
          <Button variant="primary">GET STARTED</Button>
          <Button variant="secondary" onClick={handleLoginClick}>
            LOG IN
          </Button>
        </div>
      </div>
    </main>
  );
};

export default MainPart;
