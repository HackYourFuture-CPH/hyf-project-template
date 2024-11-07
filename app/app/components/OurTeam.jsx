// app/components/OurTeam.jsx
import React from "react";
import Image from "next/image"; // Import Image from Next.js
import styles from "./OurTeam.module.css"; // Import the CSS module

const OurTeam = () => {
    return (
        <section className={styles.ourTeam}>
            <h2>Our Team</h2>
            <div className={styles.teamMembers}>
                <div className={styles.member}>
                    <Image
                        src="/kiruthiga.png" // Path to the member's image in the public folder
                        alt="Kiruthiga"
                        className={styles.memberImage}
                        width={150} // Adjust width as necessary
                        height={150} // Adjust height to maintain aspect ratio
                    />
                    <h3>KIRUTHIGA</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo
                        ligula eget dolor.
                    </p>
                </div>
                <div className={styles.member}>
                    <Image
                        src="/nada.png" // Path to the member's image in the public folder
                        alt="Nada"
                        className={styles.memberImage}
                        width={150}
                        height={150}
                    />
                    <h3>NADA</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo
                        ligula eget dolor.
                    </p>
                </div>
                <div className={styles.member}>
                    <Image
                        src="/tanya.png" // Path to the member's image in the public folder
                        alt="Tanya"
                        className={styles.memberImage}
                        width={150}
                        height={150}
                    />
                    <h3>TANYA</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo
                        ligula eget dolor.
                    </p>
                </div>
                <div className={styles.member}>
                    <Image
                        src="/moein.png" // Path to the member's image in the public folder
                        alt="Moein"
                        className={styles.memberImage}
                        width={150}
                        height={150}
                    />
                    <h3>MOEIN</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo
                        ligula eget dolor.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OurTeam;
