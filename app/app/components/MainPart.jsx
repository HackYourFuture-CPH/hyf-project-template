// app/components/MainPart.jsx
import React from "react";
import styles from "./MainPart.module.css"; // Import the CSS module
import Button from "./Button"; // Import the Button component

const MainPart = () => {
    return (
        <main className={styles.mainPart}>
            <h1 className={styles.mainTitle}>
                Welcome to Leaf Notes Your personal space to track, cherish, and explore your
                reading journey.
            </h1>
            <div className={styles.descriptionContainer}>
                <p className={styles.description}>
                    With Leaf Notes, you can organize your reading history, jot down your thoughts,
                    and set reading goals—all in one place.
                </p>
                <div className={styles.buttonContainer}>
                    <Button variant="primary">GET STARTED</Button>
                    <Button variant="secondary">LOG IN</Button>
                </div>
            </div>
        </main>
    );
};

export default MainPart;
