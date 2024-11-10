import React from "react";
import AppLayoutContainer from "../components/AppLayoutContainer"; // Import the AppLayoutContainer
import ProfileDetails from "../components/ProfileDetails";
import AboutUser from "../components/AboutUser";
import Bookshelf from "../components/Bookshelf";
import Quote from "../components/Quote";
import UserProgress from "../components/UserProgress";
import styles from "./ProfilePage.module.css"; // Styles for the ProfilePage

export default function ProfilePage() {
    return (
        <AppLayoutContainer>
            {" "}
            {/* Wrap content inside AppLayoutContainer */}
            <div className={styles.mainContent}>
                <div className={styles.leftSide}>
                    <ProfileDetails />
                    <AboutUser />
                </div>

                <div className={styles.middleContent}>
                    <Bookshelf />
                    <h3>Most Recent Quotes:</h3>
                    <Quote />
                    <UserProgress />
                </div>

                <div className={styles.rightSide}>
                    <h3>Favorite Quotes:</h3>
                    <Quote />
                </div>
            </div>
        </AppLayoutContainer>
    );
}
