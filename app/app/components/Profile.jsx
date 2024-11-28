"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import EditProfile from "./EditProfile";
import GoalsWidget from "./GoalsWidget";
import { useBookshelf } from "../contexts/BooksReadCountContext";
import { GoalProvider } from "../contexts/GoalContext";
import { makeRequest } from "../utils/makeRequest";
import styles from "./Profile.module.css";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mostReadGenre, setMostReadGenre] = useState(null);
    const [favoriteAuthor, setFavoriteAuthor] = useState(null);
    const { booksCount, loading, error } = useBookshelf();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await makeRequest(`/users/profile`, {}, "GET");
                setUserData(response.user);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setUserData("Error fetching user profile.");
            }
        };

        const fetchFavoriteData = async () => {
            try {
                const response = await makeRequest("/api/user-books/favorite-data", {}, "GET");
                setMostReadGenre(response.mostReadGenre);
                setFavoriteAuthor(response.favoriteAuthor);
            } catch (err) {
                console.error("Error fetching favorite data:", err);
                setMostReadGenre("Not available");
                setFavoriteAuthor("Not available");
            }
        };

        fetchUserProfile();
        fetchFavoriteData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    console.log(userData);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No user data available.</div>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div className={styles.Profile}>
                <div className={styles.Welcome}>
                    <strong>Welcome {userData.username}</strong>
                    <button className={styles.editButton} onClick={openModal}>
                        ✏️
                    </button>
                </div>
                <div className={styles.imageContainer}>
                    <img
                        alt="Profile"
                        src={userData.profileImageUrl || "/profile-default.svg"}
                        className={styles.profileImage}
                    />
                </div>
                <div className={styles.userDetailsContainer}>
                    <div>
                        <strong>About:</strong> {userData.about || "No information available."}
                    </div>
                    <div>
                        <strong>Most Read Genre:</strong> {mostReadGenre || "Not available"}
                    </div>
                    <div>
                        <strong>Favorite Author:</strong> {favoriteAuthor || "Not available"}
                    </div>
                    <div>
                        <strong>Books Read:</strong> {booksCount}
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
            <GoalProvider>
                <Box sx={{ mt: 3 }}>
                    <GoalsWidget />
                </Box>
            </GoalProvider>
        </Box>
    );
};

export default Profile;
