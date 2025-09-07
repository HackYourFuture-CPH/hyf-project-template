"use client";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import styles from "./attractions.module.css";
import { use, useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function AttractionsPage() {
  const [search, setSearch] = useState("");
  const [attractionCardData, setAttractionCardData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [filterDestination, setFilterDestination] = useState("");

  // simulate API fetch while there is no DB data

  // Function to fetch data from the API
  async function fetchAttractionCards(searchText = "", location = "") {
    try {
      if (searchText) {
        searchText = `?search=${searchText}`;
      } else if (location) {
        searchText = `?location=${location}`;
      }

      const response = await fetch(api("/attractions" + searchText));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const attractionData = await response.json();
      setAttractionCardData(attractionData.data || []);
    } catch (error) {
      console.error("Error fetching attraction cards:", error);
    }
  }

  async function fetchLocations() {
    try {
      const response = await fetch(api("/attractions/locations"));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const locationsData = await response.json();
      setLocations(locationsData.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }

  useEffect(() => {
    fetchAttractionCards();
    fetchLocations();
  }, []);

  useEffect(() => {
    // Filter and sort logic
    fetchAttractionCards(search, "");
  }, [search]);

  useEffect(() => {
    if (sortKey) {
      fetchAttractionCards("", sortKey);
    }
  }, [sortKey]);

  useEffect(() => {
    fetchAttractionCards();
  }, [filterDestination]);

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>All Attractions</h1>
        </div>
        <div className={styles.searchAndSortWrapper}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Attractions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={styles.filterButton}
            value=""
            onClick={() => fetchAttractionCards()}
          >
            All
          </button>

          <select
            className={styles.filterSelect}
            value=""
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="">Sort by City</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.gridContainer}>
          {attractionCardData.map((card) => (
            <AttractionCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
