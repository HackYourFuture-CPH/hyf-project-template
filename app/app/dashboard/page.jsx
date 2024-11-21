"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AppLayoutContainer from "../components/AppLayoutContainer";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import QuotesList from "../components/QuotesList";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [booksReadCount, setBooksReadCount] = useState(0);

    if (!currentUser) {
        return <p>Loading user data...</p>;
    }

    return (
        <AppLayoutContainer>
            <div className={styles.mainContent}>
                <>
                    <div className={styles.leftSide}>
                        <Profile userId={currentUser.user.id} booksReadCount={booksReadCount} />
                    </div>
                    <div className={styles.middleContent}>
                        <Bookshelf
                            userId={currentUser.user.id}
                            updateBooksReadCount={setBooksReadCount}
                        />
                    </div>
                    <div className={styles.rightSide}>
                        <QuotesList userId={currentUser.user.id} />
                    </div>
                </>
            </div>
        </AppLayoutContainer>
    );
}
