import React from "react";
import Button from "../components/Button";
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

    return (
        <div className={styles.profileDetails}>
            <Button>Edit Profile</Button>
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
        </div>
    );
};

export default ProfileDetails;
