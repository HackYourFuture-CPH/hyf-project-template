import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import EditProfile from "./EditProfile";
import styles from "./Profile.module.css";

const Profile = ({ userId, booksReadCount }) => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/users/profile/`,
          {
            withCredentials: true,
          }
        );
        setUserData(response.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error fetching user profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteGenre = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/user-books/favorite-genre`,
          {
            withCredentials: true,
          }
        );
        setFavoriteGenre(response.data.favoriteGenre);
      } catch (err) {
        console.error("Error fetching favorite genre:", err);
        setFavoriteGenre("Not available.");
      }
    };

    fetchUserProfile();
    fetchFavoriteGenre();
  }, [userId]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>No user data available.</div>;

  return (
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
          <strong>Name:</strong> {`${userData.firstName} ${userData.lastName}`}
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
  );
};

export default Profile;
