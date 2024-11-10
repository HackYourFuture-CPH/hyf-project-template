"use client";

import React, { useState } from "react";
import Button from "../components/Button";
import EditProfile from "../components/EditProfile"; // Import the EditProfile component
import styles from "./ProfileDetails.module.css";
import profileData from "../data/profileData.json";

const ProfileDetails = () => {
    const {
        name,
        src,
        gender,
        booksRead,
        booksCurrentlyReading,
        favoriteAuthor,
        favoriteBooks,
        activity,
    } = profileData.user;

    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    const openModal = () => setModalOpen(true); // Open modal
    const closeModal = () => setModalOpen(false); // Close modal

    return (
        <div className={styles.profileDetails}>
            <Button onClick={openModal}>Edit Profile</Button>
            <div className={styles.imageContainer}>
                <img alt="Profile" src={src} />
            </div>
            <div className={styles.userDetailsContainer}>
                <div>
                    <strong>Name:</strong> {name}
                </div>
                <div>
                    <strong>Gender:</strong> {gender}
                </div>
                <div>
                    <strong>Activity:</strong> {activity}
                </div>
                <div>
                    <strong>Favorite Books:</strong>
                </div>
                <ul>
                    {favoriteBooks.map((book, idx) => (
                        <li key={idx}>{book}</li>
                    ))}
                </ul>
                <div>
                    <strong>Books Read:</strong> {booksRead}
                </div>
                <div>
                    <strong>Books Currently Reading:</strong> {booksCurrentlyReading}
                </div>
                <div>
                    <strong>Favorite Author:</strong> {favoriteAuthor}
                </div>
            </div>

            {/* Render the EditProfile modal when isModalOpen is true */}
            <EditProfile isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default ProfileDetails;
