import React, { useState } from "react";
import axios from "axios";
import styles from "./EditProfile.module.css";
import Button from "./Button";

const EditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    username: userData?.username || "",
    about: userData?.about || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      if (selectedFile) {
        formDataToSend.append("profile", selectedFile);
      }
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("about", formData.about);

      setUploading(true);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/users/update/details`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSave(response.data.updatedUser); // Pass updated user data to parent
      window.location.reload();
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter a new username..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label>About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Upload Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {selectedFile && (
            <div className={styles.imagePreview}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Profile Preview"
                className={styles.profileImage}
              />
            </div>
          )}

          <Button
            type="submit"
            className={styles.saveButton}
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
