import React, { useState, useEffect } from "react";
import Button from "./Button";
import EditProfile from "./EditProfile";
import GoalsWidget from "./GoalsWidget";
import { makeRequest } from "../utils/makeRequest";
import styles from "./Profile.module.css";

const Profile = ({ booksReadCount }) => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await makeRequest("/users/profile", {}, "GET");
        setUserData(response.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error fetching user profile.");
      } finally {
        setLoading(false);
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
            <strong>Books Read:</strong> {booksReadCount}
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
      <GoalsWidget booksReadCount={booksReadCount} />
    </Box>
  );
};

export default Profile;
