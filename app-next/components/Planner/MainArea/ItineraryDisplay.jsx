import styles from "./MainArea.module.css";
import AIModifier from "./AIModifier";

export default function ItineraryDisplay({
  itinerary,
  onModifyItinerary,
  isLoading,
}) {
  const itineraryDays = itinerary?.itinerary || itinerary;

  if (
    !itineraryDays ||
    !Array.isArray(itineraryDays) ||
    itineraryDays.length === 0
  ) {
    return (
      <div className={styles.itineraryContainer}>
        <h2>Your Itinerary</h2>
        <p>
          No itinerary has been generated yet. Go to the "Vote" step and click
          "Generate Itinerary".
        </p>
      </div>
    );
  }

  return (
    <div className={styles.itineraryContainer}>
      <h2>Your AI-Generated Itinerary</h2>
      {itineraryDays.map((day) => (
        <div key={day.day}>
          <h4>
            Day {day.day}: {day.title}
          </h4>
          <ul>
            {day.activities.map((activity, index) => (
              <li key={index}>
                <strong>{activity.time}:</strong> {activity.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <AIModifier onModify={onModifyItinerary} isLoading={isLoading} />
    </div>
  );
}
