"use client";
import styles from "./attractionDetails.module.css";
import { useParams } from "next/navigation";
import attractionData from "../../../mockData/BlogPostsData.json";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostMeta from "@/components/PostMeta/PostMeta";
import Comment from "@/components/CommentSection/Comment";

export default function AttractionDetailsPage() {
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);

  useEffect(() => {
    if (id) {
      // Api Fetch the attraction details based on the id

      // TODO: Replace with actual data fetching logic
      const found = attractionData.find((item) => item.id === parseInt(id));
      console.log("Found attraction:", found);

      setAttraction(found);
    }
  }, [id]);

  if (!attraction) return <p>Loading...</p>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.travelCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={attraction.image}
            alt={attraction.destination || "Blog image"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>{attraction.title}</h4>
          <div className={styles.postMeta}>
            <PostMeta />
          </div>
          <div className={styles.meta}>
            <span>{attraction.country}</span>
          </div>
          <div className={styles.description}>{attraction.excerpt}</div>
        </div>
       <Comment />
      </div>
    </div>
  );
}
