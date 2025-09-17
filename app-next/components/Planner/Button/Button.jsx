import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const buttonStyle =
    variant === "secondary" ? styles.secondary : styles.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.actionButton} ${buttonStyle} ${className}`}
    >
      {children}
    </button>
  );
}
