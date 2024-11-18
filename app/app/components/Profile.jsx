import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import EditProfile from "./EditProfile";
import styles from "./Profile.module.css";

const Profile = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/profile/`, {
                    withCredentials: true, // For cookies or token-based authentication
                });
                setUserData(response.data.user);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Error fetching user profile.");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No user data available.</div>;

    return (
        <div className={styles.Profile}>
            <Button onClick={openModal}>EDIT BIO</Button>
            <div className={styles.imageContainer}>
                <img
                    alt="Profile"
                    src={userData.profileImageUrl || "/profile-default.svg"}
                    className={styles.profileImage}
                />
            </div>
            <div className={styles.userDetailsContainer}>
                <div>
                    <strong>Name:</strong> {`${userData.firstName} ${userData.lastName}`}
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
                        setUserData(updatedData);
                        closeModal();
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
