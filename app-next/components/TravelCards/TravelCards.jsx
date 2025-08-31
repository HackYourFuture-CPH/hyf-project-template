"use client"; // if in Next.js app dir
import { useEffect, useState } from "react";
import styles from "./TravelCards.module.css";
import traveldata from "../../mockData/travel-cards.json";
import Card from "../Card/Card";
import Link from "next/link";

export default function TravelCards() {
  const [travelCardData, setTravelCardData] = useState([]);

  // simulate API fetch
  useEffect(() => {
    setTravelCardData(traveldata);
    console.log("travelCardData", traveldata);
  }, []);

  return (
    <>
      <div className={styles.gridContainer}>
        {travelCardData.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <Link href="/trips" style={{ textDecoration: "none" }}>
        <button className={styles.exploreBtn}>Explore more</button>
      </Link>
    </>
  );
}
