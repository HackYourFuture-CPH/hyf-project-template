import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

export default function VotingPoll({
  items = [],
  onGenerateItinerary,
  onVote,
}) {
  return (
    <div className={styles.sidebarModule}>
      <h3>Vote for Attractions</h3>
      <div className={styles.voteItems}>
        {items.map((item) => (
          <div key={item.shortlistItemId} className={styles.voteItem}>
            <span>{item.name}</span>
            <div className={styles.voteControls}>
              <span className={styles.voteCount}>{item.voteCount} votes</span>
              <button
                className={`${styles.voteButton} ${
                  item.userHasVoted ? styles.voted : ""
                }`}
                onClick={() => onVote(item.shortlistItemId)}
              >
                {item.userHasVoted ? "Voted" : "Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onGenerateItinerary}>Generate Itinerary</Button>
    </div>
  );
}
