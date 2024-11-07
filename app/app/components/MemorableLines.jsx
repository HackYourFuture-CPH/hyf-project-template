// app/components/MemorableLines.jsx
import React from "react";
import Image from "next/image"; // Import Image from Next.js
import styles from "./MemorableLines.module.css"; // Import the CSS module

const MemorableLines = () => {
    return (
        <section className={styles.memorableLines}>
            <h2>Memorable Lines from Literature</h2>
            <div className={styles.linesContainer}>
                <div className={styles.line}>
                    <Image
                        src="/little-prince.png"
                        alt="The Little Prince"
                        className={styles.quoteImage}
                        width={100} // Adjust as needed
                        height={100} // Adjust as needed
                    />
                    <blockquote className={styles.blockquote}>
                        “You become responsible, forever, for what you have tamed.”
                    </blockquote>
                    <h3 className={styles.bookTitle}>THE LITTLE PRINCE</h3>
                    <p className={styles.author}>ANTOINE DE SAINT-EXUPÉRY</p>
                </div>
                <div className={styles.line}>
                    <Image
                        src="/don-quixote.png"
                        alt="Don Quixote"
                        className={styles.quoteImage}
                        width={100} // Adjust as needed
                        height={100} // Adjust as needed
                    />
                    <blockquote className={styles.blockquote}>
                        “He who reads a lot and walks a lot sees a lot and knows a lot.”
                    </blockquote>
                    <h3 className={styles.bookTitle}>DON QUIXOTE</h3>
                    <p className={styles.author}>MIGUEL DE CERVANTES</p>
                </div>
            </div>
        </section>
    );
};

export default MemorableLines;
