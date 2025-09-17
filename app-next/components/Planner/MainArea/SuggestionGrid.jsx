import styles from "./MainArea.module.css";
import Card from "../Card/Card";

export default function SuggestionGrid({
  suggestions = [],
  onAddToShortlist,
  shortlistedItems = [],
}) {
  return (
    <div className={styles.gridContainer}>
      {suggestions.map((item) => (
        <Card
          key={item.id}
          item={item}
          onSelect={() => onAddToShortlist(item)}
          isSelected={!!shortlistedItems.find((i) => i.id === item.id)}
          buttonText="❤️ Add to Shortlist"
        />
      ))}
    </div>
  );
}
