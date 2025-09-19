import styles from "./Sidebar.module.css";
import PreferenceCollector from "./PreferenceCollector";
import TripShortlist from "./TripShortlist";
import VotingPoll from "./VotingPoll";
import AccommodationSelector from "./AccommodationSelector";
import FlightSelector from "./FlightSelector";
import ChatWindow from "./ChatWindow";
import ItineraryActions from "./ItineraryActions";

export default function Sidebar({
  phase,
  isLoading,
  onGetSuggestions,
  shortlistedItems,
  selectedAccommodation,
  selectedFlight,
  messages,
  onSendMessage,
  onStartVote,
  onVote,
  onGenerateItinerary,
  onSelectAccommodations,
  onSelectFlights,
  onFinalize,
}) {
  const renderModule = () => {
    switch (phase) {
      case "preferences":
        return (
          <PreferenceCollector
            isLoading={isLoading}
            onGetSuggestions={onGetSuggestions}
          />
        );
      case "shortlisting":
        return (
          <TripShortlist items={shortlistedItems} onStartVote={onStartVote} />
        );
      case "voting":
        return (
          <>
            <TripShortlist items={shortlistedItems} onStartVote={onStartVote} />
            <VotingPoll
              items={shortlistedItems}
              onGenerateItinerary={onGenerateItinerary}
              onVote={onVote}
            />
          </>
        );
      case "itinerary":
        return (
          <ItineraryActions onSelectAccommodations={onSelectAccommodations} />
        );
      case "accommodations":
        return (
          <AccommodationSelector
            selected={selectedAccommodation}
            onSelectFlights={onSelectFlights}
          />
        );
      case "flights":
        return (
          <FlightSelector selected={selectedFlight} onFinalize={onFinalize} />
        );
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar}>
      {renderModule()}
      <ChatWindow
        messages={messages}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </aside>
  );
}
