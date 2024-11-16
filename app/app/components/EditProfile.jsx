import React, { useState } from "react";
import styles from "./EditProfile.module.css";
import Button from "./Button";

const EditProfile = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        profileImageUrl: "",
        username: "",
        booksReadCount: "",
        favoriteBooks: "",
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submit (you can implement actual save logic here)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        onClose(); // Close modal after submission
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2>Edit Bio</h2>
                <form onSubmit={handleSubmit}>
                    {formData.profileImageUrl && (
                        <div className={styles.imagePreview}>
                            <img
                                src={formData.profileImageUrl}
                                alt="Profile Preview"
                                className={styles.profileImage}
                            />
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter Username..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Favorite Books</label>
                        <input
                            type="text"
                            name="favoriteBooks"
                            value={formData.favoriteBooks}
                            onChange={handleChange}
                            placeholder="Enter Favorite Books..."
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Profile Image URL</label>
                        <input
                            type="text"
                            name="profileImageUrl"
                            value={formData.profileImageUrl}
                            onChange={handleChange}
                            placeholder="Enter Profile Image URL..."
                        />
                    </div>

                    <Button type="submit" className={styles.saveButton}>
                        Save
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
