import React from "react";
import Image from "next/image";
import styles from "./MemorableLines.module.css";

const MemorableLines = () => {
    return (
        <section className={styles.memorableLines}>
            <h2>Memorable Lines from Literature</h2>
            <div className={styles.linesContainer}>
                <div className={styles.line}>
                    <div className={styles.blockquoteContainer}>
                        <Image
                            src="/book-icon.png"
                            alt="The Little Prince"
                            className={styles.quoteImage}
                            width={100}
                            height={100}
                        />
                        <h6 className={styles.blockquote}>
                            “You become responsible, forever, for what you have tamed.”
                        </h6>
                    </div>
                    <p className={styles.bookTitle}>THE LITTLE PRINCE</p>
                    <p className={styles.author}>ANTOINE DE SAINT-EXUPÉRY</p>
                </div>
                <div className={styles.line}>
                    <div className={styles.blockquoteContainer}>
                        <Image
                            src="/book-icon.png"
                            alt="Don Quixote"
                            className={styles.quoteImage}
                            width={100}
                            height={100}
                        />
                        <h6 className={styles.blockquote}>
                            “He who reads a lot and walks a lot sees a lot and knows a lot.”
                        </h6>
                    </div>
                    <p className={styles.bookTitle}>DON QUIXOTE</p>
                    <p className={styles.author}>MIGUEL DE CERVANTES</p>
                </div>
            </div>
        </section>
    );
};

export default MemorableLines;
