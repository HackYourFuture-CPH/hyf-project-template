// app/components/SignIn.jsx
import React from "react";
import styles from "./SignIn.module.css"; // Import the CSS module
import Button from "./Button"; // Import the Button component

const SignIn = () => {
    return (
        <section className={styles.signIn}>
            <h2 className={styles.signInTitle}>Join Leaf Notes</h2>
            <p className={styles.signInDescription}>
                Already a member? Sign in to continue your journey, or create a free account to
                start your own book log today!
            </p>
            <div className={styles.buttonContainer}>
                <Button variant="primary" className={styles.signInButton}>
                    SIGN IN
                </Button>
                <Button variant="secondary" className={styles.signUpButton}>
                    SIGN UP
                </Button>
            </div>
            <h3 className={styles.benefitsTitle}>Benefits for Signing Up:</h3>
            <ul className={styles.benefitsList}>
                <li>Access your personal book log anytime, anywhere.</li>
                <li>Set and track reading goals.</li>
                <li>Save favorite quotes and personal reflections.</li>
            </ul>
        </section>
    );
};

export default SignIn;
