"use client";

import { useEffect, useState } from "react";
import styles from "./AttractionsSection.module.css"; 
import api from "../../utils/api.js";
import Link from "next/link";
import AttractionCard from "../AttractionCard/AttractionCard";

export default function AttractionsSection() {
  const [attractionCardData, setAttractionCardData] = useState([]);

  // simulate API fetch while there is no DB data

  // Function to fetch data from the API
  async function fetchAttractionCards() {
    try {

     
      const response = await fetch( api("/attractions"));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const attractionData = await response.json();
      setAttractionCardData(attractionData.data || []);
    } catch (error) {
      console.error("Error fetching attraction cards:", error);
    }
  }

  useEffect(() => {
    fetchAttractionCards();
  }, []);


  return (
    <>
      <div className={styles.toursWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Popular Attractions</h1>
          <Link href="/attractions" style={{ textDecoration: "none" }}>
            <button className={styles.exploreBtn}>Show all</button>
          </Link>
        </div>
        <div className={styles.gridContainer}>
          {attractionCardData.slice(0, 3).map((card) => (
            <AttractionCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
