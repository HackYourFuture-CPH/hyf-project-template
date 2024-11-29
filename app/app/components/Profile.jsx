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
    const [mostReadGenres, setMostReadGenres] = useState([]);
    const [favoriteAuthors, setFavoriteAuthors] = useState([]);
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
                setMostReadGenres(response.mostReadGenres || ["Not available"]);
                setFavoriteAuthors(response.favoriteAuthors || ["Not available"]);
            } catch (err) {
                console.error("Error fetching favorite data:", err);
                setMostReadGenres(["Not available"]);
                setFavoriteAuthors(["Not available"]);
            }
        };

        fetchUserProfile();
        fetchFavoriteData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
                        <strong>Most Read Genres:</strong>{" "}
                        {mostReadGenres.length ? mostReadGenres.join(", ") : "Not available"}
                    </div>
                    <div>
                        <strong>Favorite Authors:</strong>{" "}
                        {favoriteAuthors.length ? favoriteAuthors.join(", ") : "Not available"}
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
