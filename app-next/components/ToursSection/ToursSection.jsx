"use client";

import { useEffect, useState } from "react";
import styles from "./ToursSection.module.css";
import Card from "../Card/Card";
import Link from "next/link";

export default function ToursSection() {
  const [travelCardData, setTravelCardData] = useState([]);

  // Function to fetch data from the API
  async function fetchTravelCards() {
    try {
      const response = await fetch("http://localhost:3001/api/health");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTravelCardData(data.travel_plans || []);
    } catch (error) {
      console.error("Error fetching travel cards:", error);
    }
  }

  useEffect(() => {
    fetchTravelCards();
  }, []);

  return (
    <>
      <div className={styles.toursWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Popular Tours</h1>
          <Link href="/tours" style={{ textDecoration: "none" }}>
            <button className={styles.exploreBtn}>Show all</button>
          </Link>
        </div>
        <div className={styles.gridContainer}>
          {travelCardData.slice(0, 3).map((card) => (
            <Link key={card.id} href={`/tours/${card.id}`} style={{ textDecoration: "none" }}>
              <Card card={card} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
