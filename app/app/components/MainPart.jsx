// app/components/MainPart.jsx
import React from "react";
import styles from "./MainPart.module.css"; // Import the CSS module

const MainPart = () => {
    return (
        <main className={styles.mainPart}>
            <h1>Welcome to Leaf Notes</h1>
            <p>Your personal space to track, cherish, and explore your reading journey.</p>
        </main>
    );
};

export default MainPart;
