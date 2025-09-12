import Link from "next/link";
import Image from "next/image";
import styles from "./TourDetails.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function TourDetails({ params }) {
  const { id } = params;

  let tour = null;
  try {
    const res = await fetch(`${API_URL}/api/tours/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      // normalize common shapes
      tour = data.tour ?? data.travel_plan ?? data;
      if (Array.isArray(tour)) tour = tour.find((t) => t.id === id) ?? null;
    } else {
      // fallback: fetch list and find by id
      const listRes = await fetch(`${API_URL}/api/tours?limit=100`, { cache: "no-store" });
      if (listRes.ok) {
        const listData = await listRes.json();
        const all = Array.isArray(listData.tours)
          ? listData.tours
          : Array.isArray(listData)
            ? listData
            : [];
        tour = all.find((t) => t.id === id) ?? null;
      }
    }
  } catch (e) {
    // swallow — render "not found" below
    console.error(e);
  }

  if (!tour) {
    return (
      <div className={styles.container}>
        <Link href="/tours" className={styles.backLink}>
          ← Back
        </Link>
        <h1 className={styles.title}>Tour not found</h1>
        <p className={styles.description}>The requested tour could not be loaded.</p>
      </div>
    );
  }

  // Normalize image source similar to Card components:
  // - replace placehold.co placeholders with deterministic picsum seeds
  // - if backend-relative path ("/images/.."), prefer a deterministic picsum placeholder
  const raw = tour.cover_image_url || tour.image_url || "";
  const normalize = (s) => {
    if (!s || typeof s !== "string" || s.trim() === "") return null;
    const t = s.trim();
    if (t.includes("placehold.co")) {
      const seed = tour?.id ? `tour-${tour.id}` : encodeURIComponent(t);
      return `https://picsum.photos/seed/${seed}/1200/800`;
    }
    if (t.startsWith("/images/")) {
      // Avoid depending on backend asset availability during SSR; use placeholder.
      return `https://picsum.photos/seed/tour-${tour.id || "default"}/1200/800`;
    }
    return t;
  };

  const imageSrc = normalize(raw) || "/card-images/default.webp";
  // price_usd comes as minor units string like "455000" -> convert to decimal
  const rawPrice = Number(tour.price_usd ?? tour.price_minor ?? 0);
  const priceNumber = Number.isFinite(rawPrice) ? rawPrice / 100 : 0;
  const currencySymbol = tour.currency_symbol ?? tour.currency_code ?? "$";
  const priceDisplay = `${currencySymbol} ${priceNumber.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const rating = tour.average_rating ?? tour.rating ?? null;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back
      </Link>

      <div className={styles.gridWrapper}>
        {" "}
        <div className={styles.grid}>
          <div className={styles.mediaCard}>
            <div className={styles.mediaInner}>
              <Image
                src={imageSrc}
                alt={tour.name || "tour image"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>

          <aside className={styles.aside}>
            <h2 className={styles.title}>{tour.name}</h2>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{priceDisplay}</div>
                <div className={styles.statSmall}>per person</div>
              </div>

              <div className={styles.stat}>
                <div className={styles.statValue}>{tour.duration_days ?? "-"}</div>
                <div className={styles.statSmall}>days</div>
              </div>

              <div className={styles.statAlt}>
                <div className={styles.statValue} style={{ color: "#f59e0b" }}>
                  {rating ? `★ ${rating}` : "N/A"}
                </div>
                <div className={styles.statSmall}>rating</div>
              </div>

              <div className={styles.statAlt}>
                <div className={styles.statValue} style={{ color: "#10b981" }}>
                  {tour.capacity ?? "-"}
                </div>
                <div className={styles.statSmall}>capacity</div>
              </div>
            </div>

            <p className={styles.description}>{tour.long_description ?? tour.description ?? ""}</p>

            <div className={styles.ctaWrap}>
              <button className={styles.bookBtn} type="button">
                Book Now
              </button>
            </div>
          </aside>
        </div>
      </div>

      <section className={styles.details}>
        <h3>Details</h3>
        <div className={styles.detailsContent}>
          <p>
            <strong>Destination:</strong> {tour.destination ?? "—"}
          </p>
          <p>
            <strong>Duration:</strong> {tour.duration_days ?? "—"} days
          </p>
          <p>
            <strong>Capacity:</strong> {tour.capacity ?? "—"}
          </p>
          <p>
            <strong>Price:</strong> {priceDisplay}
          </p>
          <p style={{ marginTop: 12 }}>{tour.long_description ?? tour.description ?? ""}</p>
        </div>
      </section>
    </div>
  );
}
