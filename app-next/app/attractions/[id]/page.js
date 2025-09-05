"use client";
import styles from "./attractionDetails.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostMeta from "@/components/PostMeta/PostMeta";
import Comment from "@/components/CommentSection/Comment";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AttractionDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);

  // Function to fetch data from the API
  async function fetchSingleAttraction() {
    try {
      const response = await fetch(
        ` http://localhost:3001/api/attractions/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const attractionData = await response.json();
      setAttraction(attractionData.data || []);
    } catch (error) {
      console.error("Error fetching attraction cards:", error);
    }
  }

  useEffect(() => {
    fetchSingleAttraction();
  }, []);

  if (!attraction) return <p>Loading...</p>;

  return (
    <>
      <div className={`container ${styles.contentBox}`}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.travelCard}>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"
              alt={
                attraction.destination ||
                "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"
              }
              fill
              style={{ objectFit: "cover" }}
              className={styles.image}
            />
          </div>
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{attraction.title}</h4>
            <div className={styles.postMeta}>
              <PostMeta />
            </div>
            <div className={styles.meta}>
              <span>{attraction.location}</span>
            </div>
            <div className={styles.description}>{attraction.content}</div>
          </div>
          <Comment />
        </div>
      </div>
    </>
  );
}
