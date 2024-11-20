"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AppLayoutContainer from "../components/AppLayoutContainer";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import QuotesList from "../components/QuotesList";
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
                    </div>
                    <div className={styles.rightSide}>
                        <QuotesList userId={currentUser.user.id} />
                    </div>
                </>
            </div>
        </AppLayoutContainer>
    );
}
