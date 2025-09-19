import styles from "./MainArea.module.css";
import Card from "../Card/Card";
import Button from "../Button/Button";

export default function AccommodationDisplay({
  accommodations = [],
  onSelectAccommodation,
  selectedAccommodation,
  onConfirm,
}) {
  return (
    <div className={styles.displayContainer}>
      <h2>Select Your Hotel</h2>
      <div className={styles.gridContainer}>
        {accommodations.map((item) => (
          <Card
            key={item.id}
            item={item}
            onSelect={() => onSelectAccommodation(item)}
            isSelected={selectedAccommodation?.id === item.id}
            buttonText="Select Hotel"
          />
        ))}
      </div>
      <Button
        onClick={onConfirm}
        disabled={!selectedAccommodation}
        className={styles.confirmButton}
      >
        Confirm Hotel & Select Flights
      </Button>
    </div>
  );
}
