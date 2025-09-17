import styles from "./Card.module.css";
import Button from "../Button/Button";

export default function Card({
  item,
  onSelect,
  isSelected,
  buttonText = "Select",
}) {
  return (
    <div className={styles.mockCard}>
      <div className={styles.imageWrapper}>
        <img
          src={item.image || "https://picsum.photos/400/300"}
          alt={item.name}
        />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{item.name}</h4>
        <p className={styles.details}>
          {item.price ? `$${item.price}` : ""}
          {item.details ? ` - ${item.details}` : ""}
        </p>
        <div className={styles.footer}>
          <Button onClick={() => onSelect(item)} disabled={isSelected}>
            {isSelected ? "✅ Selected" : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
