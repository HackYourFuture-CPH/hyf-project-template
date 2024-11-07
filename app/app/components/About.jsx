// app/components/About.jsx
import React from "react";
import Image from "next/image"; // Import Image from Next.js
import styles from "./About.module.css"; // Import the CSS module

const About = () => {
    return (
        <section className={styles.about}>
            <h2 className={styles.aboutTitle}>About Leaf Notes</h2>
            <p className={styles.aboutDescription}>
                Leaf Notes was created for book lovers, by book lovers. We believe that every
                reading journey is unique and deserves to be celebrated. Our mission is to provide a
                space where readers can document, reflect, and connect with the books that shape
                their lives.
            </p>
            <div className={styles.authorContainer}>
                <Image
                    src="/dr-seuss.png" // Ensure the image is in the public folder
                    alt="Dr. Seuss"
                    className={styles.authorImage}
                    width={100} // Set the width
                    height={100} // Set the height
                />
                <div className={styles.quoteContainer}>
                    <h3>Dr. Seuss</h3>
                    <blockquote>
                        The more that you read, the more things you will know. The more that you
                        learn, the more places you'll go.
                    </blockquote>
                    <a href="#" className={styles.learnMore}>
                        More About Dr. Seuss
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;
