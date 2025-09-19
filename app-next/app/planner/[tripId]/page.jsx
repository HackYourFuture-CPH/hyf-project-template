"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import styles from "./planner.module.css";
import CreateTripForm from "../../../components/planner/CreateTripForm/CreateTripForm";
import ProgressTracker from "../../../components/planner/ProgressTracker/ProgressTracker";
import Sidebar from "../../../components/planner/Sidebar/Sidebar";
import MainArea from "../../../components/planner/MainArea/MainArea";
import BookingView from "../../../components/planner/BookingView/BookingView";
import mockData from "../../../components/planner/mockData";
import EmptyState from "../../../components/planner/MainArea/EmptyState";
import SuggestionGrid from "../../../components/planner/MainArea/SuggestionGrid";
import ItineraryDisplay from "../../../components/planner/MainArea/ItineraryDisplay";
import AccommodationDisplay from "../../../components/planner/MainArea/AccommodationDisplay";
import FlightDisplay from "../../../components/planner/MainArea/FlightDisplay";

export default function PlannerPage() {
  const { tripId } = useParams();
  const [view, setView] = useState("loading");
  const [tripData, setTripData] = useState(null);
  const [planningPhase, setPlanningPhase] = useState("preferences");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [shortlistedItems, setShortlistedItems] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const checkOwnership = (trip) => {
    const userData = localStorage.getItem("user");
    if (userData && trip) {
      const currentUser = JSON.parse(userData);
      setIsOwner(trip.owner_id === currentUser.id);
    }
  };

  const fetchTripData = useCallback(async () => {
    if (tripId === "new" || !tripId) {
      setView("create");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/shortlist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/itinerary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [tripRes, shortlistRes, itineraryRes, chatRes] = res;
      if (!tripRes.ok || !shortlistRes.ok) throw new Error("Failed to load trip data.");

      const tripResult = await tripRes.json();
      const shortlistResult = await shortlistRes.json();

      setTripData(tripResult.data);
      setShortlistedItems(shortlistResult.data);
      setCollaborators(tripResult.data.collaborators || []);
      checkOwnership(tripResult.data);

      if (itineraryRes.ok) {
        const itineraryResult = await itineraryRes.json();
        setItinerary(itineraryResult.data);
      }
      if (chatRes.ok) {
        const chatResult = await chatRes.json();
        setMessages(chatResult.data);
      }

      if (view !== "planner") {
        setPlanningPhase(tripResult.data.currentPhase || "preferences");
        setView("planner");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  }, [tripId, view]);

  useEffect(() => {
    fetchTripData();
    const intervalId = setInterval(fetchTripData, 15000);
    return () => clearInterval(intervalId);
  }, [tripId, fetchTripData]);

  const handleTripCreated = async (formData) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create trip");
      }
      const result = await response.json();
      const newTrip = result.data;
      window.location.replace(`/planner/${newTrip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert(`Could not create trip: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleGetSuggestions = async (preferenceText) => {
    if (tripId === "new" || !tripId) {
      alert("Please create a trip before getting AI suggestions.");
      return;
    }
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/ai-suggestions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ preferences: preferenceText }),
        }
      );
      if (!response.ok) throw new Error("Failed to get suggestions");
      const returnedSuggestions = await response.json();
      setSuggestions(returnedSuggestions.data);
      setPlanningPhase("shortlisting");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      alert("Could not get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToShortlist = async (attraction) => {
    if (shortlistedItems.find((item) => item.id === attraction.id)) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/shortlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ attraction_id: attraction.id }),
        }
      );
      if (!response.ok) throw new Error("Failed to add to shortlist");
      const shortlistRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/shortlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const shortlistResult = await shortlistRes.json();
      setShortlistedItems(shortlistResult.data);
    } catch (error) {
      console.error("Error adding to shortlist:", error);
      alert("Could not add item to shortlist.");
    }
  };

  const handleVote = async (shortlistItemId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/shortlist/${shortlistItemId}/vote`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to update vote");

      const result = await response.json();
      setShortlistedItems((currentItems) =>
        currentItems.map((item) => {
          if (item.shortlistItemId === shortlistItemId) {
            return {
              ...item,
              voteCount: result.voteCount,
              userHasVoted: result.userHasVoted,
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error voting:", error);
      alert("Could not process your vote.");
    }
  };

  const handleGenerateItinerary = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/itinerary`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to generate itinerary");
      const result = await response.json();
      setItinerary(result.data);
      setPlanningPhase("itinerary");
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("Could not generate the itinerary. Please ensure items are shortlisted and voted on.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyItinerary = async (command) => {
    if (!itinerary) {
      alert("An itinerary must be generated before it can be modified.");
      return;
    }
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/itinerary/modify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            command: command,
            currentItinerary: itinerary,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to modify itinerary");
      const result = await response.json();
      setItinerary(result.data);
    } catch (error) {
      console.error("Error modifying itinerary:", error);
      alert("Could not modify the itinerary. Please try a different command.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAccommodation = async () => {
    if (!selectedAccommodation) {
      alert("Please select an accommodation first.");
      return;
    }
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selected_accommodation_id: selectedAccommodation.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to save hotel selection.");
      setPlanningPhase("flights");
    } catch (error) {
      console.error("Error confirming accommodation:", error);
      alert("Could not save your hotel selection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeAndBook = async () => {
    if (!selectedFlight) {
      alert("Please select a flight first.");
      return;
    }
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selected_flight_id: selectedFlight.id }),
      });
      setView("booking");
    } catch (error) {
      console.error("Error saving flight selection:", error);
      alert("Could not save your flight selection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/custom-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trip_id: tripId,
          num_travelers: collaborators.length || 1,
        }),
      });
      if (!response.ok) throw new Error("Booking failed.");
      alert("Booking successful! Your trip is confirmed.");
      window.location.href = "/planner/new";
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("There was an error confirming your booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${tripId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageContent }),
      });
      if (!response.ok) throw new Error("Message failed to send.");
      fetchTripData();
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    }
  };

  const handleStartVote = () => {
    if (shortlistedItems.length > 0) setPlanningPhase("voting");
    else alert("Please shortlist at least one attraction to start a vote.");
  };

  const handleSelectAccommodations = () => setPlanningPhase("accommodations");
  const handleSelectFlights = () => setPlanningPhase("flights");

  const renderMainContent = () => {
    switch (planningPhase) {
      case "preferences":
        return <EmptyState destination={tripData?.destination} />;
      case "shortlisting":
      case "voting":
        return (
          <SuggestionGrid
            suggestions={suggestions}
            onAddToShortlist={handleAddToShortlist}
            shortlistedItems={shortlistedItems}
          />
        );
      case "itinerary":
        return itinerary ? (
          <ItineraryDisplay
            itinerary={itinerary}
            onModifyItinerary={handleModifyItinerary}
            isLoading={isLoading}
          />
        ) : (
          <div>Loading itinerary...</div>
        );
      case "accommodations":
        return (
          <AccommodationDisplay
            accommodations={mockData.accommodations}
            onSelectAccommodation={setSelectedAccommodation}
            selectedAccommodation={selectedAccommodation}
            onConfirm={handleConfirmAccommodation}
            tripData={tripData}
          />
        );
      case "flights":
        return (
          <FlightDisplay
            flights={mockData.flights}
            onSelectFlight={setSelectedFlight}
            selectedFlight={selectedFlight}
          />
        );
      default:
        return <EmptyState />;
    }
  };

  if (view === "loading") {
    return <div>Loading your trip...</div>;
  }

  if (view === "create") {
    return (
      <main className={styles.createFormLayout}>
        <CreateTripForm onTripCreate={handleTripCreated} isLoading={isLoading} />
      </main>
    );
  }

  if (view === "planner") {
    return (
      <main className={styles.plannerLayout}>
        <div className={styles.pageWrapper}>
          <div className={styles.titleContainer}>
            <div className={styles.headerRow}>
              <div className={styles.backButtonWrapper}>
                <Link
                  className={styles.backButton}
                  href="/planner/new"
                  aria-label="Back to create trip"
                >
                  ← Back
                </Link>
              </div>

              <div className={styles.titleWrapper}>
                <h1 className={styles.title}>Trip Planner</h1>
              </div>

              <div style={{ width: "48px" }} aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <ProgressTracker currentPhase={planningPhase} onPhaseChange={setPlanningPhase} />

        <div className={styles.plannerContent}>
          <aside className={styles.sidebarContainer}>
            <Sidebar
              phase={planningPhase}
              isLoading={isLoading}
              onGetSuggestions={handleGetSuggestions}
              shortlistedItems={shortlistedItems}
              selectedAccommodation={selectedAccommodation}
              selectedFlight={selectedFlight}
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartVote={handleStartVote}
              onVote={handleVote}
              onGenerateItinerary={handleGenerateItinerary}
              onSelectAccommodations={handleSelectAccommodations}
              onSelectFlights={handleSelectFlights}
              onFinalize={handleFinalizeAndBook}
            />
          </aside>
          <section className={styles.mainAreaContainer}>
            <MainArea isOwner={isOwner} collaborators={collaborators}>
              {renderMainContent()}
            </MainArea>
          </section>
        </div>
      </main>
    );
  }

  if (view === "booking") {
    return (
      <main className={styles.createFormLayout}>
        <BookingView
          accommodation={selectedAccommodation}
          flight={selectedFlight}
          onPay={handleConfirmBooking}
          isLoading={isLoading}
        />
      </main>
    );
  }

  return <div>An unexpected error occurred.</div>;
}
