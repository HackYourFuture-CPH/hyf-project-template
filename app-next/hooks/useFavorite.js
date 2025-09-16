import { useEffect, useState, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function useFavorite({ itemId, itemType = "post", initial } = {}) {
  const [favourite, setFavourite] = useState(Boolean(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // initialize from localStorage if initial not provided
  useEffect(() => {
    if (typeof itemId === "undefined" || itemId === null) return;
    if (typeof initial !== "undefined") {
      setFavourite(Boolean(initial));
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (
        Array.isArray(saved) &&
        saved.find((f) => String(f.itemId || f.item_id) === String(itemId))
      ) {
        setFavourite(true);
      }
    } catch (_) {
      // ignore
    }
  }, [itemId, initial]);

  // Listen for global favoritesChanged events to stay in sync
  useEffect(() => {
    if (typeof window === "undefined") return;
    function handler(e) {
      try {
        const detail = e?.detail || {};
        if (String(detail.itemId) === String(itemId)) {
          if (typeof detail.added === "boolean") setFavourite(Boolean(detail.added));
        }
      } catch (_) {
        // ignore
      }
    }
    window.addEventListener("favoritesChanged", handler);
    return () => window.removeEventListener("favoritesChanged", handler);
  }, [itemId]);

  async function toggle(e) {
    if (typeof itemId === "undefined" || itemId === null) return;
    try {
      e?.stopPropagation?.();
      e?.preventDefault?.();
    } catch (_) {}

    const next = !favourite;
    setFavourite(next);
    setLoading(true);
    setError(null);

    // update localStorage fallback
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (next) {
        localStorage.setItem(
          "favorites",
          JSON.stringify([...saved, { itemId: String(itemId), type: itemType }])
        );
      } else {
        localStorage.setItem(
          "favorites",
          JSON.stringify(saved.filter((f) => String(f.itemId || f.item_id) !== String(itemId)))
        );
      }
    } catch (_) {
      // ignore
    }

    // dispatch event for other parts of UI
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("favoritesChanged", { detail: { added: next, itemId } })
        );
      }
    } catch (_) {}

    // server call (only if token present). If no token we'll keep local-only favorite.
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (!token) {
        // no auth — treat as local-only favorite
        setLoading(false);
        return;
      }
      if (token) headers.Authorization = `Bearer ${token}`;

      if (next) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "POST",
          headers,
          body: JSON.stringify({ item_id: itemId, item_type: itemType }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
      } else {
        const res = await fetch(`${API_URL}/api/favorites/${itemId}`, {
          method: "DELETE",
          headers,
        });
        if (!res.ok && res.status !== 404) throw new Error("Failed to remove favorite");
      }
    } catch (err) {
      // revert optimistic update on error
      setFavourite(!next);
      setError(err?.message || String(err));
      try {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!next) {
          localStorage.setItem(
            "favorites",
            JSON.stringify([...saved, { itemId: String(itemId), type: itemType }])
          );
        } else {
          localStorage.setItem(
            "favorites",
            JSON.stringify(saved.filter((f) => String(f.itemId || f.item_id) !== String(itemId)))
          );
        }
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }

  return { favourite, toggle, loading, error, setFavourite };
}
