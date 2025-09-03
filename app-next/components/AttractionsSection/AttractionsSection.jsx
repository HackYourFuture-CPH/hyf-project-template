"use client";

import { useEffect, useState } from "react";
import styles from "./AttractionsSection.module.css"; 
import BlogPostsData from "../../mockData/BlogPostsData.json";
import Link from "next/link";
import AttractionCard from "../AttractionCard/AttractionCard";

export default function AttractionsSection() {
  const [blogPostsCardData, setBlogPostsCardData] = useState([]);

  // simulate API fetch while there is no DB data
  useEffect(() => {
    setBlogPostsCardData(BlogPostsData);
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
          {blogPostsCardData.slice(0, 3).map((card) => (
            <AttractionCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
