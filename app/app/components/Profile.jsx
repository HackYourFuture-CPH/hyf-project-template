"use client";
import { useState, useEffect } from "react";
import Button from "./Button";
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
  const [favoriteGenre, setFavoriteGenre] = useState(null);
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

    const fetchFavoriteGenre = async () => {
      try {
        const response = await makeRequest(
          "/api/user-books/favorite-genre",
          {},
          "GET"
        );
        setFavoriteGenre(response.favoriteGenre);
      } catch (err) {
        console.error("Error fetching favorite genre:", err);
        setFavoriteGenre("Not available.");
      }
    };

    fetchUserProfile();
    fetchFavoriteGenre();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div className={styles.Profile}>
        <Button onClick={openModal}>EDIT PROFILE</Button>
        <div className={styles.imageContainer}>
          <img
            alt="Profile"
            src={userData.profileImageUrl || "/profile-default.svg"}
            className={styles.profileImage}
          />
        </div>
        <div className={styles.userDetailsContainer}>
          <div>
            <strong>Name:</strong>{" "}
            {`${userData.firstName} ${userData.lastName}`}
          </div>
          <div>
            <strong>Username:</strong> {userData.username}
          </div>
          <div>
            <strong>Email:</strong> {userData.email}
          </div>
          <div>
            <strong>About:</strong>{" "}
            {userData.about || "No information available."}
          </div>
          <div>
            <strong>Favorite Genre:</strong> {favoriteGenre || "Not available"}
          </div>
          <ul>
            {userData.favoriteBooks &&
              userData.favoriteBooks.length > 0 &&
              userData.favoriteBooks.map((book, idx) => (
                <li key={idx}>{book}</li>
              ))}
          </ul>
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
