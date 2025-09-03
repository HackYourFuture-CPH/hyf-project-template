"use client";

import { useEffect, useState } from "react";
import styles from "./BlogPostsSection.module.css";
import traveldata from "../../mockData/travel-cards.json";
import Card from "../Card/Card";
import Link from "next/link";

export default function BlogPostsSection() {
  const [travelCardData, setTravelCardData] = useState([]);

  // simulate API fetch while there is no DB data
  useEffect(() => {
    setTravelCardData(traveldata);
    console.log("travelCardData", traveldata);
  }, []);

  return (
    <>
      <div className={styles.toursWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>User Blog Posts</h1>
          <Link href="/trips" style={{ textDecoration: "none" }}>
            <button className={styles.exploreBtn}>Show all</button>
          </Link>
        </div>
        <div className={styles.gridContainer}>
          {travelCardData.slice(0, 3).map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
