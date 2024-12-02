"use client";

import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";

const Footer = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 600); // Show button after scrolling 600px
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerBottom}>
                <p>COPYRIGHT ©2024 ALL RIGHTS RESERVED | THIS WEB APP IS MADE BY Q-CODE TEAM</p>
            </div>
            {showButton && (
                <button
                    className={styles.scrollToTop}
                    onClick={scrollToTop}
                    aria-label="Scroll to Top"
                >
                    <img src="/arrow-up.png" alt="Scroll to top" className={styles.icon} />
                </button>
            )}
        </footer>
    );
};

export default Footer;
