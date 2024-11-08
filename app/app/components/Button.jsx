import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, children, type = "button", variant = "primary", className }) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
