"use client";

import { useEffect, useState } from "react";
import styles from "./BlogPostsSection.module.css"; 
import BlogPostsData from "../../mockData/BlogPostsData.json";

import Card from "../Card/Card";
import Link from "next/link";
import BlogCard from "../BlogCard/BlogCard";

export default function BlogPostsSection() {
  const [blogPostsCardData, setBlogPostsCardData] = useState([]);

  // simulate API fetch while there is no DB data
  useEffect(() => {
    setBlogPostsCardData(BlogPostsData);
  }, []);

  return (
    <>
      <div className={styles.toursWrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>User Blog Posts</h1>
          <Link href="/blogs" style={{ textDecoration: "none" }}>
            <button className={styles.exploreBtn}>Show all</button>
          </Link>
        </div>
        <div className={styles.gridContainer}>
          {blogPostsCardData.slice(0, 3).map((card) => (
            <BlogCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
