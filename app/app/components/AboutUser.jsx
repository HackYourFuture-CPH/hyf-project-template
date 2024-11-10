import React from "react";
import styles from "./AboutUser.module.css";
import profileData from "../data/profileData.json";

const AboutUser = () => {
    const about = profileData.about;
    return (
        <div className={styles.aboutUser}>
            <h3>About</h3>
            <p>{about}</p>
        </div>
    );
};

export default AboutUser;
