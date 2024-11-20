"use client";

import React from "react";
import AppLayoutContainer from "../components/AppLayoutContainer";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import Quote from "../components/Quote";
import MostRecentQuote from "../components/MostRecentQuote";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Dashboard.module.css";

export default function ProfilePage() {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return <p>Loading user data...</p>;
    }
    return (
        <AppLayoutContainer>
            <div className={styles.mainContent}>
                <>
                    <div className={styles.leftSide}>
                        <Profile userId={currentUser.user.id} />
                    </div>
                    <div className={styles.middleContent}>
                        <Bookshelf userId={currentUser.user.id} />
                        <h3>Most Recent Quotes:</h3>
                        <MostRecentQuote />
                    </div>
                    <div className={styles.rightSide}>
                        <h3>Favorite Quotes:</h3>
                        <Quote userId={currentUser.user.id} />
                    </div>
                </>
            </div>
        </AppLayoutContainer>
    );
}
