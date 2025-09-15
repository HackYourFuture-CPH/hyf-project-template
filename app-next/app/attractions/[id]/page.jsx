"use client";
import styles from "./attractionDetails.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostMeta from "@/components/PostMeta/PostMeta";
import Comment from "@/components/CommentSection/Comment";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AttractionDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [imageSrc, setImageSrc] = useState(null);

  // Function to fetch data from the API
  async function fetchSingleAttraction() {
    try {
      const response = await fetch(`${API_URL}/api/attractions/${id}`);
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

  useEffect(() => {
    if (!attraction) return;
    const raw = attraction.cover_image_url || attraction.image_url || "";
    const placeholder = attraction?.id
      ? `https://picsum.photos/seed/attraction-${attraction.id}/1200/800`
      : "/images/attractions/default.jpg";

    const normalize = (s) => {
      if (!s || typeof s !== "string" || s.trim() === "") return null;
      const t = s.trim();
      if (t.includes("placehold.co")) {
        const seed = attraction?.id ? `attraction-${attraction.id}` : encodeURIComponent(t);
        return `https://picsum.photos/seed/${seed}/1200/800`;
      }
      if (t.startsWith("/images/")) return null;
      return t;
    };

    const norm = normalize(raw);
    if (norm) {
      setImageSrc(norm);
      return;
    }

    setImageSrc(placeholder);
    if (raw && raw.startsWith("/images/")) {
      let cancelled = false;
      (async () => {
        try {
          const url = `${API_URL}${raw}`;
          const res = await fetch(url, { method: "HEAD" });
          if (!cancelled && res.ok) setImageSrc(url);
        } catch (e) {
          // keep placeholder
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [attraction]);

  if (!attraction) return <p>Loading...</p>;

  // Prepare display values
  const rawTitle = attraction.title ?? attraction.name ?? "Untitled";
  const title = rawTitle.replace(/:\s*[0-9a-f]{6,32}$/i, "").trim();

  const author = attraction.author_name ?? attraction.author ?? attraction.user ?? attraction.created_by ?? null;
  const createdAt = attraction.created_at ? new Date(attraction.created_at) : null;
  const formattedDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const rawCategory = attraction.category ?? attraction.type ?? null;
  const category = rawCategory
    ? String(rawCategory).toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())
    : null;

  return (
    <>
      <div className={`container ${styles.contentBox}`}>
        <Link className={styles.backButton} href="/" aria-label="Back to home">
          ← Back
        </Link>
      </div>
      <div className={styles.pageWrapper}>
        <div className={styles.travelCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc || attraction.cover_image_url || "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500"}
              alt={attraction.destination || title || "Attraction image"}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{title}</h4>
            <div className={styles.postMeta}>
              <PostMeta authorName={author} date={formattedDate} category={category} itemId={attraction.id} itemType="attraction" />
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
