import React from "react";
import styles from "./MainPart.module.css";
import Button from "./Button";
import Link from "next/link";

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
                    <Link href="/signup">
                        <Button variant="primary">GET STARTED</Button>
                    </Link>
                    <Link href="/signin">
                        <Button variant="secondary">LOG IN</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default MainPart;
