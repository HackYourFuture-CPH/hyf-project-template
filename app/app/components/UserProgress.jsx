import React from "react";
import styles from "./UserProgress.module.css";
import profileData from "../data/profileData.json";

const UserProgress = () => {
    const { monthlyProgress, yearlyProgress } = profileData;
    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressSection}>
                <h4>Monthly Progress (October 2024)</h4>
                <ul>
                    <li>Books Read: {monthlyProgress.booksRead}</li>
                    <li>Pages Read: {monthlyProgress.pagesRead} Pages</li>
                    <li>
                        Reading Goal: {monthlyProgress.goal} Books ({monthlyProgress.goalPercentage}
                        %)
                    </li>
                </ul>
            </div>

            <div className={styles.progressSection}>
                <h4>Yearly Progress (2024)</h4>
                <ul>
                    <li>Books Read: {yearlyProgress.booksRead}</li>
                    <li>Pages Read: {yearlyProgress.pagesRead} Pages</li>
                    <li>
                        Reading Goal: {yearlyProgress.goal} Books ({yearlyProgress.goalPercentage}%)
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserProgress;
