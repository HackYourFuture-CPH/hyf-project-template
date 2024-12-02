"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./OurTeam.module.css";

const OurTeam = () => {
    const [members, setMembers] = useState([]); // State to hold the member data
    const [visibleMembers, setVisibleMembers] = useState([]); // State for visibility
    const membersRef = useRef([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch("/q-code/qcode-members.json");
            const data = await response.json();
            setMembers(data);
            setVisibleMembers(Array(data.length).fill(false)); // Initialize visibility based on member count
        };

        fetchMembers();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setVisibleMembers((prev) => {
                        const updated = [...prev];
                        updated[index] = true; // Set member to visible
                        return updated;
                    });
                } else {
                    // Optionally hide the member when it leaves the viewport
                    setVisibleMembers((prev) => {
                        const updated = [...prev];
                        updated[index] = false;
                        return updated;
                    });
                }
            });
        });

        membersRef.current.forEach((member) => {
            if (member) {
                observer.observe(member);
            }
        });

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [members]);

    return (
        <section className={styles.ourTeam}>
            <h2>Our Team</h2>
            <div className={styles.teamMembers}>
                {members.map((member, index) => (
                    <div
                        key={member.name}
                        className={`${styles.member} ${visibleMembers[index] ? styles.visible : ""}`}
                        ref={(el) => (membersRef.current[index] = el)}
                    >
                        <img src={member.src} alt={member.name} className={styles.memberImage} />
                        <p>{member.name.toUpperCase()}</p>

                        <div className={styles.socialMediaIcons}>
                            <a href={member.GitHub} target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/social-media/github.png"
                                    alt="GitHub"
                                    className={styles.socialIcon}
                                />
                            </a>
                            <a href={member.LinkedIn} target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/social-media/linkedin.png"
                                    alt="LinkedIn"
                                    className={styles.socialIcon}
                                />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurTeam;
