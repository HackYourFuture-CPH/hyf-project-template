"use client";

import { useEffect, useState } from "react";
import styles from "./ToursSection.module.css";
import Card from "../Card/Card";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ToursSection() {
  const [travelCardData, setTravelCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchTravelCards() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("limit", "3");

        const res = await fetch(`${API_URL}/api/tours?${params.toString()}`, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let list = [];
        if (Array.isArray(data.tours)) list = data.tours;
        else if (Array.isArray(data.travel_plans)) list = data.travel_plans;
        else if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.tours?.items)) list = data.tours.items; // defensive

        setTravelCardData(list);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchTravelCards();
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.toursWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Popular Tours</h1>
        <Link href="/tours" style={{ textDecoration: "none" }}>
          <button className={styles.exploreBtn}>Show all</button>
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <div className={styles.gridContainer}>
          {travelCardData.slice(0, 3).map((card) => (
            <Card
              key={card.id}
              card={card}
              onFavoriteChange={() => { /* forwarded by Card and global event */ }}
              viewLink={`/tours/${card.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
