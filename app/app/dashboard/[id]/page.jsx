"use client";

import React, { useEffect, useState } from "react";
import AppLayoutContainer from "../../components/AppLayoutContainer";
import Profile from "../../components/Profile";
import Bookshelf from "../../components/Bookshelf";
import Quote from "../../components/Quote";
import MostRecentQuote from "../../components/MostRecentQuote";
import UserProgress from "../../components/UserProgress";
import styles from "../Dashboard.module.css";
import axios from "axios";

export default function UserProfilePage({ params }) {
    const { id } = params; // Get the user ID from the URL using the params prop
    const [userData, setUserData] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        // Fetch user data from the backend based on the `id` parameter
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/profile/${id}`, {
                    withCredentials: true, // Send cookies with the request
                });
                setUserData(response.data); // Set user data from response
                setLoading(false); // Stop loading
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Error fetching user data.");
                setLoading(false); // Stop loading
            }
        };

        fetchUserData();
    }, [id]); // Re-run the effect whenever `id` changes

    if (loading) return <p>Loading...</p>; // Show loading message while data is being fetched
    if (error) return <p>{error}</p>; // Show error message if there's an issue fetching data

    return (
        <AppLayoutContainer>
            <div className={styles.mainContent}>
                <div className={styles.leftSide}>
                    <Profile userData={userData} /> {/* Pass user data to Profile */}
                </div>

                <div className={styles.middleContent}>
                    <Bookshelf userId={id} /> {/* Pass userId to Bookshelf */}
                    <h3>Most Recent Quotes:</h3>
                    <MostRecentQuote quotes={userData.recentQuotes} /> {/* Pass recent quotes */}
                    <UserProgress progress={userData.progress} /> {/* Pass user progress */}
                </div>

                <div className={styles.rightSide}>
                    <h3>Favorite Quotes:</h3>
                    <Quote favoriteQuotes={userData.favoriteQuotes} /> {/* Pass favorite quotes */}
                </div>
            </div>
        </AppLayoutContainer>
    );
}
