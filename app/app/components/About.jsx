import React from "react";
import Image from "next/image";
import styles from "./About.module.css";

const About = () => {
    return (
        <section className={styles.about}>
            <div className={styles.textContainer}>
                <h2 className={styles.aboutTitle}>About Leaf Notes</h2>
                <p className={styles.aboutDescription}>
                    Leaf Notes was created for book lovers, by book lovers. We believe that every
                    reading journey is unique and deserves to be celebrated. Our mission is to
                    provide a space where readers can document, reflect, and connect with the books
                    that shape their lives.
                </p>
                <a href="#" className={styles.learnMore}>
                    LEARN MORE
                </a>
            </div>
            <div className={styles.authorContainer}>
                <Image
                    src="/dr.seuss.jpg"
                    alt="Dr. Seuss"
                    className={styles.authorImage}
                    width={100}
                    height={100}
                />
                <div className={styles.quoteContainer}>
                    <h2>Dr. Seuss</h2>
                    <blockquote>
                        The more that you read, the more things you will know. The more that you
                        learn, the more places you'll go.
                    </blockquote>
                    <a href="https://en.wikipedia.org/wiki/Dr._Seuss" className={styles.learnMore}>
                        More About Dr. Seuss
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;
