"use client";

import { useEffect, useState } from "react";
import styles from "./BlogPostsSection.module.css";
import api from "../../utils/api.js";
import Link from "next/link";
import BlogCard from "../BlogCard/BlogCard";

export default function BlogPostsSection() {
  const [blogPostsData, setBlogPostsData] = useState([]);

  // Function to fetch data from the API
  async function fetchBlogPopsts() {
    try {
      const response = await fetch(api("/blogposts"));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blogsData = await response.json();
      setBlogPostsData(blogsData.data || []);
    } catch (error) {
      console.error("Error fetching blog cards:", error);
    }
  }

  useEffect(() => {
    fetchBlogPopsts();
  }, []);

  return (
    <>
      <div className={styles.toursWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.blogsTitleContainer}>
            <h1 className={styles.title}>User Blog Posts</h1>
            <p>(Explore journeys shared by fellow travelers)</p>
          </div>
          <Link href="/blogs" style={{ textDecoration: "none" }}>
            <button className={styles.exploreBtn}>Show all</button>
          </Link>
        </div>
        <div className={styles.gridContainer}>
          {blogPostsData.slice(0, 3).map((card) => (
            <BlogCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
