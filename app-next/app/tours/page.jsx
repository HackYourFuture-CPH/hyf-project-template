"use client";

import styles from "./Trip.module.css";
import Card from "../../components/Card/Card";
import { useState, useEffect } from "react";

export default function TripPage() {
  const [search, setSearch] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("");

  // Simple fetch function
  async function fetchTours() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortKey === "price_asc") {
        params.append("sortKey", "price_minor");
        params.append("sortDir", "asc");
      } else if (sortKey === "price_desc") {
        params.append("sortKey", "price_minor");
        params.append("sortDir", "desc");
      } else if (sortKey === "rating_asc") {
        params.append("sortKey", "rating");
        params.append("sortDir", "asc");
      } else if (sortKey === "rating_desc") {
        params.append("sortKey", "rating");
        params.append("sortDir", "desc");
      }

      const response = await fetch(`http://localhost:3001/api/tours?${params.toString()}`);
      const data = await response.json();
      setTours(data.travel_plans || []);
      // Get unique destinations (if you have them in the tours data)
      // setDestinations(...);
    } catch (error) {
      console.error("Error fetching tours", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTours();
  }, [sortKey]);

  // Filter tours by search and destination
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      !search ||
      tour.name?.toLowerCase().includes(search.toLowerCase()) ||
      tour.description?.toLowerCase().includes(search.toLowerCase());
    // You may need to match destination using your data structure
    const matchesDestination =
      !filterDestination ||
      (filterDestination &&
        // You may need to check tour_destinations for this tour's destinations
        true);
    return matchesSearch && matchesDestination;
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>All Tours</h1>
      </div>
      <div className={styles.searchAndSortWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search Tours"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={filterDestination}
          onChange={(e) => setFilterDestination(e.target.value)}
        >
          <option value="">All Destinations</option>
          {destinations.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>
      <div className={styles.gridContainer}>
        {loading ? (
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          filteredTours.map((card) => <Card key={card.id} card={card} />)
        )}
      </div>
    </div>
  );
}
