"use client";
import styles from "./BlogCard.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function BlogCard({ card }) {
  const [favourite, setFavourite] = useState(card.favourite);

  const raw = card?.cover_image_url;
  const placeholder = card?.id ? `https://picsum.photos/seed/blog-${card.id}/600/400` : "https://picsum.photos/600/400";

  const normalize = (src) => {
    if (typeof src !== "string" || src.trim() === "") return null;
    const s = src.trim();
    if (s.includes("placehold.co")) {
      const seed = card?.id ? `blog-${card.id}` : encodeURIComponent(s);
      return `https://picsum.photos/seed/${seed}/600/400`;
    }
    if (s.startsWith("/images/")) return `${API_URL}${s}`;
    return s;
  };

  const isBackendPath = typeof raw === "string" && raw.trim().startsWith("/images/");
  const initial = isBackendPath ? placeholder : (normalize(raw) || placeholder);
  const [imageSrc, setImageSrc] = useState(initial);

  // HEAD-check backend file existence for backend-relative paths, then switch
  // to the real URL if it exists. This reduces initial Next.js proxy 404s.
  useEffect(() => {
    if (!isBackendPath) return;
    let cancelled = false;
    const url = `${API_URL}${raw}`;
    (async () => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!cancelled && res.ok) setImageSrc(url);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [raw]);
  // Prepare display values
  const rawTitle = card.title ?? card.name ?? "Untitled";
  // If the title ends with a colon + hex/hash suffix (e.g. ": c4ca4238a0"), strip it
  const title = rawTitle.replace(/:\s*[0-9a-f]{6,32}$/i, "").trim();

  const author = card.author_name ?? card.author ?? card.user ?? card.created_by ?? null;
  const createdAt = card.created_at ? new Date(card.created_at) : null;
  const formattedDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const rawCategory = card.category ?? card.type ?? null;
  const category = rawCategory
    ? String(rawCategory).toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())
    : null;

  // Normalize author and avatar: backend may return author as string or user object
  let avatar = card.author_profile_image || card.profile_image || card.author_image || null;
  let authorName = card.author_name ?? card.author ?? null;
  if (!authorName && card.user) {
    if (typeof card.user === "string") authorName = card.user;
    else if (typeof card.user === "object") {
      const full = card.user.full_name || `${card.user.first_name || ""} ${card.user.last_name || ""}`.trim();
      // Detect placeholder names like First1 Last1 from seeded data and prefer username
      const isPlaceholder = (n) => typeof n === "string" && /^\s*(first\d*|last\d*)\s*$/i.test(n);
      const isFullPlaceholder = (() => {
        const parts = full.split(/\s+/).filter(Boolean);
        if (parts.length === 0) return false;
        return parts.every((p) => isPlaceholder(p));
      })();
      authorName = !isFullPlaceholder && full ? full : card.user.username || null;
      avatar = avatar || card.user.profile_image || card.user.avatar || null;
    }
  }

  return (
    <Link href={`/blogs/${card.id}`} style={{ textDecoration: "none" }}>
      <div className={styles.travelCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={title || "Blog image"}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            onError={() => setImageSrc(placeholder)}
          />
        </div>
          <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>{title}</h4>
          <div className={styles.meta}>
            {/* Use PostMeta-style layout inline: show avatar and name */}
            {authorName ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {avatar ? (
                  <img src={avatar} alt={authorName} style={{ width: 28, height: 28, borderRadius: 999 }} />
                ) : null}
                <span>by {authorName}</span>
              </span>
            ) : null}
            {formattedDate ? (
              <span style={{ marginLeft: author ? 8 : 0 }}>{formattedDate}</span>
            ) : null}
            {category ? (
              <span style={{ marginLeft: 8 }}>&bull; {category}</span>
            ) : null}
          </div>
          <p className={styles.description}>{card.content}</p>
        </div>
      </div>
    </Link>
  );
}
