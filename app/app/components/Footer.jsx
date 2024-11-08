// app/components/Footer.jsx
import React from "react";
import styles from "./Footer.module.css"; // Import the CSS module

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.socialMedia}>
                    <h3 className={styles.footerHeading}>SOCIAL MEDIA LINKS</h3>
                    <div className={styles.socialIcons}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img
                                className={styles.socialIcon}
                                width="50"
                                height="50"
                                src="social-media/instagram-new--v1.png"
                                alt="instagram"
                            />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img
                                className={styles.socialIcon}
                                width="50"
                                height="50"
                                src="social-media/facebook--v1.png"
                                alt="facebook"
                            />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                            <img
                                className={styles.socialIcon}
                                width="50"
                                height="50"
                                src="social-media/twitterx--v1.png"
                                alt="twitter"
                            />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <img
                                className={styles.socialIcon}
                                width="50"
                                height="50"
                                src="social-media/youtube-squared.png"
                                alt="youtube"
                            />
                        </a>
                    </div>
                </div>
                <div className={styles.navigation}>
                    <h3 className={styles.footerHeading}>NAVIGATION</h3>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/about">About Us</a>
                        </li>
                        <li>
                            <a href="/signin">Sign In</a>
                        </li>
                        <li>
                            <a href="/search">Search</a>
                        </li>
                    </ul>
                </div>
                <div className={styles.contact}>
                    <h3 className={styles.footerHeading}>CONTACT US</h3>
                    <p>
                        Questions? Reach us at{" "}
                        <a href="support@leafnotes.com">support@leafnotes.com</a>
                    </p>
                </div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.footerBottom}>
                <p>COPYRIGHT ©2024 ALL RIGHTS RESERVED | THIS WEB APP IS MADE BY Q-CODE TEAM</p>
            </div>
        </footer>
    );
};

export default Footer;
