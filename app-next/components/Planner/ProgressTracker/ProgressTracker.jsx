import styles from "./ProgressTracker.module.css";

export default function ProgressTracker({ currentPhase, onPhaseChange }) {
  const phases = [
    { key: "preferences", label: "1. Preferences" },
    { key: "shortlisting", label: "2. Shortlist" },
    { key: "voting", label: "3. Vote" },
    { key: "itinerary", label: "4. Itinerary" },
    { key: "accommodations", label: "5. Hotel" },
    { key: "flights", label: "6. Flights" },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.key === currentPhase);

  return (
    <div className={styles.progressTracker}>
      {phases.map((phase, index) => {
        const isCompleted = index < currentPhaseIndex;
        const isActive = index === currentPhaseIndex;

        let statusClass = "";
        if (isCompleted) statusClass = styles.completed;
        if (isActive) statusClass = styles.active;

        return (
          <button
            key={phase.key}
            className={`${styles.progressStep} ${statusClass}`}
            // A step is clickable only if it's already completed
            disabled={!isCompleted}
            onClick={() => onPhaseChange(phase.key)}
          >
            {phase.label}
          </button>
        );
      })}
    </div>
  );
}
