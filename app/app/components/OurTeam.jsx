"use client"; // Mark this component as a client component

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image"; // Import Image from Next.js
import styles from "./OurTeam.module.css"; // Import the CSS module

const OurTeam = () => {
    const [members, setMembers] = useState([]); // State to hold the member data
    const [visibleMembers, setVisibleMembers] = useState([]); // State for visibility
    const membersRef = useRef([]);

    useEffect(() => {
        // Fetch members from JSON file
        const fetchMembers = async () => {
            const response = await fetch("/q-code/qcode-members.json"); // Adjust path if necessary
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
                        updated[index] = false; // Reset visibility when out of view
                        return updated;
                    });
                }
            });
        });

        // Observe each member element
        membersRef.current.forEach((member) => {
            if (member) {
                observer.observe(member);
            }
        });

        return () => {
            // Clean up the observer on component unmount
            if (observer) {
                observer.disconnect();
            }
        };
    }, [members]); // Rerun the effect if members change

    return (
        <section className={styles.ourTeam}>
            <h2>Our Team</h2>
            <div className={styles.teamMembers}>
                {members.map((member, index) => (
                    <div
                        key={member.name}
                        className={`${styles.member} ${visibleMembers[index] ? styles.visible : ""}`}
                        ref={(el) => (membersRef.current[index] = el)} // Assign reference
                    >
                        <Image
                            src={member.src} // Use the src from JSON
                            alt={member.name}
                            className={styles.memberImage}
                            width={300}
                            height={300}
                        />
                        <h3>{member.name.toUpperCase()}</h3>

                        {/* Social media icons container */}
                        <div className={styles.socialMediaIcons}>
                            <a href={member.GitHub} target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/social-media/github.png" // Ensure this path is correct
                                    alt="GitHub"
                                    className={styles.socialIcon}
                                />
                            </a>
                            <a href={member.LinkedIn} target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/social-media/linkedin.png" // Ensure this path is correct
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
