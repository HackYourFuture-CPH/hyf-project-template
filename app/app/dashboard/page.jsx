import React from "react";
import AppLayoutContainer from "../components/AppLayoutContainer";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import Quote from "../components/Quote";
import MostRecentQuote from "../components/MostRecentQuote";
import styles from "./Dashboard.module.css";

export default function ProfilePage() {
    return (
        <AppLayoutContainer>
            <div className={styles.mainContent}>
                <div className={styles.leftSide}>
                    <Profile />
                </div>

                <div className={styles.middleContent}>
                    <Bookshelf bookShelfData={null} />
                    <h3>Most Recent Quotes:</h3>
                    <MostRecentQuote />
                </div>

                <div className={styles.rightSide}>
                    <h3>Favorite Quotes:</h3>
                    <Quote />
                </div>
            </div>
        </AppLayoutContainer>
    );
}
