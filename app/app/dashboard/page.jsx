import React from "react";
import AppLayoutContainer from "../components/AppLayoutContainer";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import Quote from "../components/Quote";
import MostRecentQuote from "../components/MostRecentQuote";
import UserProgress from "../components/UserProgress";
import profileData from "../data/profileData.json";
import styles from "./Dashboard.module.css";

export default function ProfilePage() {
    return (
        <AppLayoutContainer>
            <div className={styles.mainContent}>
                <div className={styles.leftSide}>
                    <Profile />
                </div>

                <div className={styles.middleContent}>
                    <Bookshelf />
                    <h3>Most Recent Quotes:</h3>
                    <MostRecentQuote />
                    <UserProgress />
                </div>

                <div className={styles.rightSide}>
                    <h3>Favorite Quotes:</h3>
                    <Quote favoriteQuotes={profileData.favoriteQuote} />
                </div>
            </div>
        </AppLayoutContainer>
    );
}
