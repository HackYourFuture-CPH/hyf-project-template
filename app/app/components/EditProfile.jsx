import { useState } from "react";
import { useErrorModal } from "../hooks/useErrorModal";
import ErrorModal from "./ErrorModal";
import axios from "axios";
import styles from "./EditProfile.module.css";
import Button from "./Button";
import { useTheme } from "../contexts/ThemeContext";
const EditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    username: userData?.username || "",
    about: userData?.about || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showError, error, hideError } = useErrorModal();

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
      if (!formData.username.trim()) {
        showError("Username is required", "Validation Error", "error");
        return;
      }

      const formDataToSend = new FormData();
      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          showError(
            "Profile image must be less than 5MB",
            "File Size Error",
            "error"
          );
          return;
        }
        formDataToSend.append("profile", selectedFile);
      }
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("about", formData.about);

      setUploading(true);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update/details`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showError("Profile updated successfully!", "Success", "success");

      setTimeout(() => {
        onSave(response.data.updatedUser);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to update profile. Please try again.";
      let errorTitle = "Profile Update Failed";

      if (error.response?.status === 409) {
        errorMessage = "Username already exists. Please choose another.";
        errorTitle = "Username Taken";
      } else if (error.response?.status === 413) {
        errorMessage = "File size too large. Please choose a smaller image.";
        errorTitle = "File Size Error";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showError(errorMessage, errorTitle, "error");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;
  const modalStyles = {
    backgroundColor: theme === "dark" ? "#1E1E1E" : "#F5EBEB",
    color: theme === "dark" ? "#FFFFFF" : "#000000",
  };
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal} style={modalStyles}>
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
      <ErrorModal
        isOpen={error.isOpen}
        onClose={hideError}
        message={error.message}
        title={error.title}
        severity={error.severity}
      />
    </>
  );
};

export default EditProfile;
