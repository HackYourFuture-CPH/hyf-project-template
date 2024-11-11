import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, children, type = "button", variant = "primary", className }) => {
    return (
        <div className={styles.buttonContainer}>
            <button
                className={`${styles.button} ${styles[variant]} ${className}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
