"use client";

import React, { useState } from "react";
import Button from "./Button";
import EditProfile from "./EditProfile";
import styles from "./Profile.module.css";

const Profile = ({ userData }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    if (!userData) return null;

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div className={styles.Profile}>
            <Button onClick={openModal}>EDIT BIO</Button>
            <div className={styles.imageContainer}>
                <img
                    alt="Profile"
                    src={userData.profile_image_url || "/profile-default.svg"}
                    className={styles.profileImage}
                />
            </div>
            <div className={styles.userDetailsContainer}>
                <div>
                    <strong>Name:</strong> {`${userData.first_name} ${userData.last_name}`}
                </div>
                <div>
                    <strong>Username:</strong> {userData.username}
                </div>
                <div>
                    <strong>Email:</strong> {userData.email}
                </div>
                <div>
                    <strong>About:</strong> {userData.about || "No information available."}
                </div>
                <div>
                    <strong>Favorite Books:</strong>
                </div>
                <ul>
                    {userData.favoriteBooks && userData.favoriteBooks.length > 0 ? (
                        userData.favoriteBooks.map((book, idx) => <li key={idx}>{book}</li>)
                    ) : (
                        <li>No favorite books added.</li>
                    )}
                </ul>
                <div>
                    <strong>Books Read:</strong> {userData.booksRead || 0}
                </div>
            </div>

            {isModalOpen && (
                <EditProfile
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    userData={userData} // Pass current user data to modal
                    onSave={(updatedData) => {
                        // Handle updating data in parent component
                        setUserData(updatedData);
                        closeModal();
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
