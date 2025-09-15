"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UploadButton } from "@uploadthing/react";
import styles from "./User.module.css";
import Card from "../../components/Card/Card";
import cardStyles from "../../components/Card/Card.module.css";
import BlogCard from "../../components/BlogCard/BlogCard";
import AttractionCard from "../../components/AttractionCard/AttractionCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function UserPage() {
  const [currentSection, setCurrentSection] = useState("summary");
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteTours, setFavoriteTours] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [favoriteAttractions, setFavoriteAttractions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cancelling, setCancelling] = useState({});
  const [removedBookings, setRemovedBookings] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "" });
  const [creatingPost, setCreatingPost] = useState(false);
  const [createError, setCreateError] = useState("");

  // helper to safely parse JSON or return text
  async function safeParseResponse(res) {
    const text = await res.text();
    try {
      return { body: JSON.parse(text), raw: text };
    } catch {
      return { body: null, raw: text };
    }
  }

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        try {
          const resProfile = await fetch(`${API_URL}/api/users/profile`, { headers });
          const parsed = await safeParseResponse(resProfile);
          if (resProfile.ok && parsed.body) {
            if (mounted) setUser(parsed.body.data || parsed.body);
          }
        } catch {}

        try {
          // fetch user's bookings (booked tours / custom trips)
          const resBookings = await fetch(`${API_URL}/api/bookings/my-bookings`, { headers });
          const parsed = await safeParseResponse(resBookings);
          if (resBookings.ok && parsed.body) {
            if (mounted) {
              const raw = parsed.body.data || parsed.body || [];
              const filtered = Array.isArray(raw)
                ? raw.filter((b) => {
                    const id = String(b.booking_id || b.id || "");
                    const status = String(b.booking_status || b.status || "").toLowerCase();
                    // filter out known-removed ids and any booking that looks cancelled
                    if (removedBookings[id]) return false;
                    if (status.includes("cancel")) return false;
                    return true;
                  })
                : raw;
              console.debug(
                "bookings.fetchData: fetched",
                raw.map((r) => ({
                  id: r.booking_id || r.id,
                  status: r.booking_status || r.status,
                })),
                "filtered ->",
                filtered.map((r) => r.booking_id || r.id),
                "removedBookings:",
                removedBookings
              );
              setBookings(filtered);
            }
          }
        } catch {}

        try {
          const resPosts = await fetch(`${API_URL}/api/blogposts/my-posts`, { headers });
          const parsed = await safeParseResponse(resPosts);
          if (resPosts.ok && parsed.body) {
            if (mounted) setPosts(parsed.body.data || parsed.body || []);
          }
        } catch {}

        try {
          const resTours = await fetch(`${API_URL}/api/tours?limit=100`, { headers });
          const parsed = await safeParseResponse(resTours);
          if (resTours.ok && parsed.body) {
            if (mounted) setTours(parsed.body.tours || parsed.body.data || parsed.body || []);
          }
        } catch {}

        try {
          const resAttractions = await fetch(`${API_URL}/api/attractions?limit=100`, { headers });
          const parsed = await safeParseResponse(resAttractions);
          if (resAttractions.ok && parsed.body) {
            if (mounted)
              setAttractions(parsed.body.attractions || parsed.body.data || parsed.body || []);
          }
        } catch {}

        try {
          const resFav = await fetch(`${API_URL}/api/favorites`, { headers });
          if (resFav.ok) {
            const parsed = await safeParseResponse(resFav);
            const favs = parsed.body?.data || parsed.body || [];
            if (mounted) {
              setFavorites(favs);
              try {
                localStorage.setItem("favorites", JSON.stringify(favs));
              } catch {}
            }
          }
        } catch {}

        try {
          // fetch public blogposts to resolve favorite posts to cards
          const resAllPosts = await fetch(`${API_URL}/api/blogposts?limit=100`, { headers });
          const parsed = await safeParseResponse(resAllPosts);
          if (resAllPosts.ok && parsed.body) {
            if (mounted) setAllPosts(parsed.body.data || parsed.body || []);
          }
        } catch {}
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // recompute favoriteTours when favorites or tours change
  // Use stable string keys as dependencies (avoid passing arrays directly)
  const favKey = Array.isArray(favorites)
    ? favorites
        .map((f) => String(f.item_id || f.itemId || f.item || ""))
        .sort()
        .join(",")
    : "";
  const toursKey = Array.isArray(tours)
    ? tours
        .map((t) => String(t.id))
        .sort()
        .join(",")
    : "";
  const postsKey = Array.isArray(allPosts)
    ? allPosts
        .map((p) => String(p.id))
        .sort()
        .join(",")
    : "";
  const attractionsKey = Array.isArray(attractions)
    ? attractions
        .map((a) => String(a.id))
        .sort()
        .join(",")
    : "";

  useEffect(() => {
    try {
      const favs = Array.isArray(favorites) ? favorites : [];
      const sourceTours = Array.isArray(tours) ? tours : [];
      // Favorite tours
      const resolvedTours = favs
        .filter((f) => (f.item_type || f.itemType || f.type) === "tour")
        .map((f) => {
          const id = String(f.item_id || f.itemId || f.item || "");
          return sourceTours.find((t) => String(t.id) === id) || null;
        })
        .filter(Boolean);
      setFavoriteTours(resolvedTours);

      // Favorite posts
      const sourcePosts = Array.isArray(allPosts) ? allPosts : [];
      const resolvedPosts = favs
        .filter((f) => (f.item_type || f.itemType || f.type) === "post")
        .map((f) => {
          const id = String(f.item_id || f.itemId || f.item || "");
          return sourcePosts.find((p) => String(p.id) === id) || null;
        })
        .filter(Boolean);
      setFavoritePosts(resolvedPosts);

      // Favorite attractions
      const sourceAttractions = Array.isArray(attractions) ? attractions : [];
      const resolvedAttractions = favs
        .filter((f) => (f.item_type || f.itemType || f.type) === "attraction")
        .map((f) => {
          const id = String(f.item_id || f.itemId || f.item || "");
          return sourceAttractions.find((a) => String(a.id) === id) || null;
        })
        .filter(Boolean);
      setFavoriteAttractions(resolvedAttractions);
    } catch {
      setFavoriteTours([]);
      setFavoritePosts([]);
      setFavoriteAttractions([]);
    }
  }, [favKey, toursKey, postsKey, attractionsKey]);

  // refresh bookings when bookingsChanged event fires
  useEffect(() => {
    function onBookingsChanged() {
      (async () => {
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          const res = await fetch(`${API_URL}/api/bookings/my-bookings`, { headers });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            const raw = data?.data || data || [];
            const filtered = Array.isArray(raw)
              ? raw.filter((b) => {
                  const id = String(b.booking_id || b.id || "");
                  const status = String(b.booking_status || b.status || "").toLowerCase();
                  if (removedBookings[id]) return false;
                  if (status.includes("cancel")) return false;
                  return true;
                })
              : raw;
            console.debug(
              "bookings.onBookingsChanged: fetched",
              raw.map((r) => ({ id: r.booking_id || r.id, status: r.booking_status || r.status })),
              "filtered ->",
              filtered.map((r) => r.booking_id || r.id),
              "removedBookings:",
              removedBookings
            );
            setBookings(filtered);
          }
        } catch {}
      })();
    }
    if (typeof window !== "undefined")
      window.addEventListener("bookingsChanged", onBookingsChanged);
    return () => {
      try {
        if (typeof window !== "undefined")
          window.removeEventListener("bookingsChanged", onBookingsChanged);
      } catch {}
    };
  }, [removedBookings]);

  async function cancelBooking(booking) {
    const id = booking.booking_id || booking.id || null;
    const type = booking.tour_id ? "tour" : booking.trip_id ? "custom" : null;
    if (!type || !id) {
      console.warn("cancelBooking: missing type or id", { booking });
      return;
    }

    // prevent duplicate cancels for same booking
    if (cancelling[String(id)]) {
      console.debug("cancelBooking: already cancelling", id);
      return;
    }

    try {
      // optimistically mark as removed so any refresh won't re-add it while
      // cancellation is in-flight
      setRemovedBookings((s) => ({ ...s, [String(id)]: true }));
      setCancelling((s) => ({ ...s, [String(id)]: true }));
      console.debug("cancelBooking: sending request", { id, type });
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/bookings/${type}/${encodeURIComponent(id)}/cancel`, {
        method: "PATCH",
        headers,
      });
      const data = await res.json().catch(() => null);
      console.debug("cancelBooking: response", { status: res.status, body: data });
      if (res.ok) {
        // remove the cancelled booking from local UI so it no longer appears
        setBookings((all) =>
          Array.isArray(all) ? all.filter((b) => String(b.booking_id || b.id) !== String(id)) : all
        );
        // don't trigger a global refresh here — we removed the booking locally to
        // avoid a race where an immediate refetch returns stale data and re-adds it.
      } else {
        console.error("Failed to cancel booking:", data || res.statusText);
        alert((data && (data.error || data.message)) || "Failed to cancel booking");
        // rollback removed mark so future refreshes include it
        setRemovedBookings((s) => {
          const copy = { ...s };
          delete copy[String(id)];
          return copy;
        });
      }
    } catch (err) {
      console.error("cancelBooking: exception", err);
      alert(err.message || "Failed to cancel booking");
      // rollback removed mark on exception
      setRemovedBookings((s) => {
        const copy = { ...s };
        delete copy[String(id)];
        return copy;
      });
    } finally {
      setCancelling((s) => {
        const copy = { ...s };
        delete copy[String(id)];
        return copy;
      });
    }
  }

  // fetch latest favorites from server and update local state + storage
  async function refreshFavorites() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/api/favorites`, { headers });
      if (res.ok) {
        const text = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { data: null };
        }
        const favs = parsed?.data || parsed || [];
        setFavorites(favs);
        try {
          localStorage.setItem("favorites", JSON.stringify(favs));
        } catch {}
      }
    } catch (err) {
      // ignore - don't block UI
    }
  }

  // Handler passed to Card components so unfavoriting a tour removes it from the UI immediately
  async function handleFavoriteChange({ added, itemId, error }) {
    try {
      if (added === false) {
        setFavorites((all) => {
          try {
            const arr = Array.isArray(all) ? all : [];
            return arr.filter(
              (f) => String(f.item_id || f.itemId || f.item || f.item_id) !== String(itemId)
            );
          } catch {
            return all;
          }
        });
      }
      refreshFavorites();
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    function onFavEvent(e) {
      try {
        refreshFavorites();
      } catch {}
    }
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesChanged", onFavEvent);
    }
    return () => {
      try {
        if (typeof window !== "undefined")
          window.removeEventListener("favoritesChanged", onFavEvent);
      } catch {}
    };
  }, []);

  // Profile view component
  function ProfileView() {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      mobile: user?.mobile || "",
      profile_image: user?.profile_image || "",
    });
    const [imagePreview, setImagePreview] = useState(user?.profile_image || "");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [pwForm, setPwForm] = useState({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    const [pwSubmitting, setPwSubmitting] = useState(false);
    const [pwMessage, setPwMessage] = useState("");

    useEffect(() => {
      setForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        mobile: user?.mobile || "",
        profile_image: user?.profile_image || "",
      });
      setImagePreview(user?.profile_image || "");
    }, [user]);

    function onChange(e) {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    }

    function onPwChange(e) {
      const { name, value } = e.target;
      setPwForm((p) => ({ ...p, [name]: value }));
      setPwMessage("");
    }

    async function onUploadComplete(res) {
      try {
        if (!res || res.length === 0) return;
        const url = res[0].url;
        setImagePreview(url);
        setForm((f) => ({ ...f, profile_image: url }));
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const payload = { profile_image: url };
        const resp = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => null);
          if (data && (data.data || data)) setUser(data.data || data);
        }
      } catch {
        // silent
      }
    }

    async function onSubmit(e) {
      e.preventDefault();
      setFormError("");
      const fname = (form.first_name || "").trim();
      const lname = (form.last_name || "").trim();
      const mobileVal = (form.mobile || "").trim();
      if (!fname) return setFormError("First name is required");
      if (!lname) return setFormError("Last name is required");
      const mobilePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!mobileVal) return setFormError("Mobile number is required");
      if (!mobilePattern.test(mobileVal)) return setFormError("Please enter a valid mobile number");
      setSubmitting(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const payload = { first_name: fname, last_name: lname, mobile: mobileVal };
        if (form.profile_image && typeof form.profile_image === "string") {
          const v = form.profile_image;
          if (v.startsWith("http://") || v.startsWith("https://")) payload.profile_image = v;
        }
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
        if (res.ok) {
          setUser(parsed.data || parsed);
          setEditing(false);
        } else {
          const details = parsed.details || parsed.errors || null;
          if (Array.isArray(details) && details.length > 0) {
            const msg = details
              .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
              .join("; ");
            setFormError(msg);
          } else {
            setFormError(parsed.message || parsed.error || parsed || "Failed to update profile");
          }
        }
      } catch (err) {
        setFormError(err.message || "Failed to update profile");
      } finally {
        setSubmitting(false);
      }
    }

    async function onPasswordSubmit(e) {
      e.preventDefault();
      setPwMessage("");
      const { current_password, new_password, new_password_confirmation } = pwForm;
      if (!current_password || !current_password.trim())
        return setPwMessage("Current password is required");
      if (!new_password || new_password.length < 8)
        return setPwMessage("New password must be at least 8 characters");
      if (new_password !== new_password_confirmation)
        return setPwMessage("New passwords do not match");
      setPwSubmitting(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/api/users/change-password`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ current_password, new_password, new_password_confirmation }),
        });
        const text = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: text };
        }
        if (res.ok) {
          setPwMessage(parsed.message || "Password changed successfully");
          setPwForm({ current_password: "", new_password: "", new_password_confirmation: "" });
          setChangingPassword(false);
        } else {
          const details = parsed.details || parsed.errors || null;
          if (Array.isArray(details) && details.length > 0) {
            const msg = details
              .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
              .join("; ");
            setPwMessage(msg);
          } else {
            setPwMessage(parsed.message || parsed.error || "Failed to change password");
          }
        }
      } catch (err) {
        setPwMessage(err.message || "Failed to change password");
      } finally {
        setPwSubmitting(false);
      }
    }

    return (
      <div className={styles.profileRow}>
        <div>
          <div className={styles.avatarWrap}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="avatar"
                className={styles.avatar}
                width={120}
                height={120}
              />
            ) : (
              <div className={styles.avatar}>
                {(user?.full_name || user?.first_name || user?.username || "")[0]}
              </div>
            )}
            {editing ? <div className={styles.avatarActions}></div> : null}
          </div>
          {editing ? (
            <div style={{ marginTop: 12 }}>
              <UploadButton
                endpoint="imageUploader"
                className={styles.uploadThingButton}
                aria-label="Upload profile photo"
                onClientUploadComplete={(res) => onUploadComplete(res)}
                onUploadError={() => {}}
              >
                Upload photo
              </UploadButton>
            </div>
          ) : null}
        </div>

        <div className={styles.info}>
          {editing ? (
            <>
              <form onSubmit={onSubmit} className={styles.profileForm}>
                <div className={styles.field}>
                  <label>First name</label>
                  <input name="first_name" value={form.first_name} onChange={onChange} />
                </div>
                <div className={styles.field}>
                  <label>Last name</label>
                  <input name="last_name" value={form.last_name} onChange={onChange} />
                </div>
                <div className={styles.field}>
                  <label>Mobile</label>
                  <input name="mobile" value={form.mobile} onChange={onChange} />
                </div>

                {formError && <div className={styles.error}>{formError}</div>}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className={styles.secondary}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className={styles.primary}>
                    {submitting ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </form>

              <div className={styles.passwordContainer} style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => {
                    setChangingPassword((c) => !c);
                    setPwMessage("");
                  }}
                >
                  {changingPassword ? "Hide password form" : "Change password"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <h3 className={styles.name}>
                {user?.full_name ||
                  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                  user?.username}
              </h3>
              <div className={styles.field}>
                <strong>Username:</strong> {user?.username || "—"}
              </div>
              <div className={styles.field}>
                <strong>Email:</strong> {user?.email || "—"}
              </div>
              <div className={styles.field}>
                <strong>Mobile:</strong> {user?.mobile || "—"}
              </div>
              <div className={styles.formActions}>
                <button onClick={() => setEditing(true)} className={styles.primary}>
                  Edit profile
                </button>
              </div>
            </div>
          )}

          {editing && changingPassword && (
            <div style={{ marginTop: 12 }}>
              <form onSubmit={onPasswordSubmit} className={styles.profileForm}>
                <div className={styles.field}>
                  <label>Current password</label>
                  <input
                    name="current_password"
                    type="password"
                    value={pwForm.current_password}
                    onChange={onPwChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>New password</label>
                  <input
                    name="new_password"
                    type="password"
                    value={pwForm.new_password}
                    onChange={onPwChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>Confirm new password</label>
                  <input
                    name="new_password_confirmation"
                    type="password"
                    value={pwForm.new_password_confirmation}
                    onChange={onPwChange}
                  />
                </div>
                {pwMessage && <div className={styles.error}>{pwMessage}</div>}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setChangingPassword(false)}
                    className={styles.secondary}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={pwSubmitting} className={styles.primary}>
                    {pwSubmitting ? "Changing…" : "Change password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderSummary() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <h2 className={styles.dashboardTitle}>Welcome!</h2>
          <p className={styles.empty}>Please log in to see your dashboard summary.</p>
        </div>
      );
    const myTrips = tours.filter(
      (t) => t.owner_id === user.id || t.owner_id === user.sub || t.owner_id === user.user_id
    );
    const upcomingTrips = myTrips.filter(
      (t) => t.start_date && new Date(t.start_date) >= new Date()
    );
    const myPosts = posts.filter((p) => p.user_id === user.id || p.user_id === user.user_id);
    const myFavorites = favorites.filter(
      (f) => f.user_id === user.id || f.user_id === user.user_id || f.userId === user.id
    );
    return (
      <div className={styles.profileCard}>
        <h2 className={styles.dashboardTitle}>
          Welcome, {user.full_name || user.first_name || user.username}!
        </h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✈️</div>
            <div>
              <div className={styles.statNumber}>{upcomingTrips.length}</div>
              <div className={styles.statLabel}>Upcoming Trips</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📰</div>
            <div>
              <div className={styles.statNumber}>{myPosts.length}</div>
              <div className={styles.statLabel}>Total Posts</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div>
              <div className={styles.statNumber}>{myFavorites.length}</div>
              <div className={styles.statLabel}>Favorites</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderTrips() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Please log in to view trips.</p>
        </div>
      );
    const myTrips = tours.filter(
      (t) => t.owner_id === user.id || t.owner_id === user.sub || t.owner_id === user.user_id
    );
    const upcoming = myTrips.filter((t) => t.start_date && new Date(t.start_date) >= new Date());
    const past = myTrips.filter((t) => t.start_date && new Date(t.start_date) < new Date());
    return (
      <div>
        <div className={styles.sectionHeader} style={{ marginBottom: 12 }}>
          <h3>My Bookings</h3>
        </div>
        <div className={styles.subSection} style={{ marginBottom: 20 }}>
          <div className={styles.cardGrid}>
            {(() => {
              const visibleBookings = Array.isArray(bookings)
                ? bookings.filter(
                    (bb) => (bb.booking_status || bb.status || "booked") !== "cancelled"
                  )
                : [];
              if (visibleBookings.length === 0)
                return <p className={styles.empty}>No bookings yet.</p>;
              return visibleBookings.map((b) => {
                const tourId = b.tour_id || null;
                const matchingTour = tourId
                  ? tours.find((t) => String(t.id) === String(tourId))
                  : null;
                if (matchingTour) {
                  // Use existing Card component for tours so the design matches exactly
                  return (
                    <div key={`booking-tour-${b.id || tourId}`} className={styles.cardWrapper}>
                      <Card
                        card={matchingTour}
                        viewLink={`/tours/${tourId}`}
                        onFavoriteChange={() => {}}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <a
                          href={`/tours/${tourId}`}
                          className={styles.secondary}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                        <button
                          className={styles.secondary}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            cancelBooking(b);
                          }}
                          disabled={
                            !!cancelling[String(b.booking_id || b.id || b.tour_id || b.trip_id)]
                          }
                        >
                          {cancelling[String(b.booking_id || b.id || b.tour_id || b.trip_id)]
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    </div>
                  );
                }

                // Fallback visual for custom trips or missing tour rows - reuse Card styles
                const link = b.tour_id
                  ? `/tours/${b.tour_id}`
                  : b.trip_id
                    ? `/trips/${b.trip_id}`
                    : `#`;
                const title = b.trip_name || b.plan_name || b.name || "Booked item";
                const img = b.cover_image_url || b.cover_image || null;
                const bookedAt = b.booked_at ? new Date(b.booked_at).toLocaleString() : null;
                const total =
                  typeof b.total_price_minor === "number"
                    ? b.total_price_minor
                    : b.total_price_minor || null;
                const currency = b.currency_code || (b.price_minor ? "USD" : null);
                const status = b.booking_status || b.status || "booked";

                return (
                  <div
                    key={b.id || `${b.tour_id || b.trip_id}-${b.booked_at || ""}`}
                    className={styles.cardWrapper}
                  >
                    <div>
                      <div className={cardStyles.travelCard} style={{ background: "transparent" }}>
                        <div className={cardStyles.imageWrapper}>
                          {img ? (
                            // plain img for fallback cards
                            <img
                              src={img}
                              alt={title}
                              style={{ width: "100%", height: "12rem", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{ width: "100%", height: "12rem", background: "#f1f5f9" }}
                            />
                          )}
                        </div>
                        <div className={cardStyles.cardContent}>
                          <h4 className={cardStyles.cardTitle}>{title}</h4>
                          <div className={cardStyles.cardMeta}>{bookedAt || "—"}</div>
                          <div className={cardStyles.cardMeta}>
                            Status: {status}
                            {total !== null ? (
                              <span>
                                {" "}
                                • {currency ? `${currency} ` : ""}
                                {(total / 100).toFixed(2)}
                              </span>
                            ) : null}
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              gap: 8,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Link href={link} className={styles.primary}>
                              View
                            </Link>
                            <button
                              className={styles.secondary}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                cancelBooking(b);
                              }}
                              disabled={
                                !!cancelling[String(b.booking_id || b.id || b.tour_id || b.trip_id)]
                              }
                            >
                              {cancelling[String(b.booking_id || b.id || b.tour_id || b.trip_id)]
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
        <div className={styles.sectionHeader}>
          <h3>My Trips</h3>
          <button className={styles.addButton}>+ Add New Trip</button>
        </div>
        <div className={styles.subSection}>
          <h4>Upcoming Trips</h4>
          <div className={styles.cardGrid}>
            {upcoming.length === 0 ? (
              <p className={styles.empty}>No upcoming trips.</p>
            ) : (
              upcoming.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardTitle}>{t.name}</div>
                  <div className={styles.cardMeta}>
                    {t.duration_days} days • {t.destination}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={styles.subSection}>
          <h4>Past Trips</h4>
          <div className={styles.cardGrid}>
            {past.length === 0 ? (
              <p className={styles.empty}>No past trips.</p>
            ) : (
              past.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardTitle}>{t.name}</div>
                  <div className={styles.cardMeta}>
                    {t.duration_days} days • {t.destination}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderPosts() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Sign in to see your posts.</p>
        </div>
      );
    const myPosts = posts.filter((p) => p.user_id === user.id || p.user_id === user.user_id);
    return (
      <div className={styles.profileCard}>
        <div className={styles.sectionHeader}>
          <h3>My Posts</h3>
          <div>
            <button
              className={styles.primary}
              onClick={() => {
                setCreateError("");
                setNewPost({ title: "", category: "", content: "" });
                setShowCreatePostModal(true);
              }}
            >
              + Create Post
            </button>
          </div>
        </div>
        {myPosts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
        <div className={styles.cardGrid}>
          {myPosts.map((p) => (
            <div key={p.id} className={styles.cardWrapper}>
              <div style={{ position: "relative" }}>
                <BlogCard card={p} />
                <div className={styles.cardActions} style={{ marginTop: 8 }}>
                  <button
                    className={styles.secondary}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateError("");
                      setNewPost({
                        id: p.id,
                        title: p.title || "",
                        category: p.category || "",
                        content: p.content || "",
                      });
                      setShowCreatePostModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.secondary}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm("Are you sure you want to delete this post?")) return;
                      setCreateError("");
                      try {
                        const token =
                          typeof window !== "undefined" ? localStorage.getItem("token") : null;
                        const headers = {};
                        if (token) headers.Authorization = `Bearer ${token}`;
                        const res = await fetch(`${API_URL}/api/blogposts/${p.id}`, {
                          method: "DELETE",
                          headers,
                        });
                        if (res.ok) {
                          setPosts((all) =>
                            Array.isArray(all) ? all.filter((x) => x.id !== p.id) : []
                          );
                        } else {
                          setPosts((all) =>
                            Array.isArray(all) ? all.filter((x) => x.id !== p.id) : []
                          );
                          const text = await res.text();
                          try {
                            const parsed = JSON.parse(text);
                            setCreateError(
                              parsed.message || parsed.error || "Failed to delete post"
                            );
                          } catch {
                            setCreateError(text || "Failed to delete post");
                          }
                        }
                      } catch (err) {
                        setPosts((all) =>
                          Array.isArray(all) ? all.filter((x) => x.id !== p.id) : []
                        );
                        setCreateError(err.message || "Failed to delete post");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderFavorites() {
    if (!user)
      return (
        <div className={styles.profileCard}>
          <p className={styles.empty}>Sign in to see favorites.</p>
        </div>
      );
    return (
      <div className={styles.profileCard}>
        <h3>Favorites</h3>

        <section style={{ marginBottom: 20 }}>
          <h4>Favorite Tours</h4>
          {!Array.isArray(favoriteTours) || favoriteTours.length === 0 ? (
            <p className={styles.empty}>No favorite tours yet.</p>
          ) : (
            <div className={styles.cardGrid}>
              {favoriteTours.map((t) => (
                <div key={t.id} className={styles.cardWrapper}>
                  <Card
                    card={t}
                    viewLink={`/tours/${t.id}`}
                    onFavoriteChange={(payload) => handleFavoriteChange(payload)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4>Favorite Posts</h4>
          {!Array.isArray(favoritePosts) || favoritePosts.length === 0 ? (
            <p className={styles.empty}>No favorite posts yet.</p>
          ) : (
            <div className={styles.cardGrid}>
              {favoritePosts.map((p) => (
                <div key={p.id} className={styles.cardWrapper}>
                  <BlogCard
                    card={p}
                    onFavoriteChange={(payload) => handleFavoriteChange(payload)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4>Favorite Attractions</h4>
          {!Array.isArray(favoriteAttractions) || favoriteAttractions.length === 0 ? (
            <p className={styles.empty}>No favorite attractions yet.</p>
          ) : (
            <div className={styles.cardGrid}>
              {favoriteAttractions.map((a) => (
                <div key={a.id} className={styles.cardWrapper}>
                  <AttractionCard
                    card={a}
                    onFavoriteChange={(payload) => handleFavoriteChange(payload)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Home
      </Link>
      <div className={styles.dashboard}>
        <aside className={styles.aside}>
          <div className={styles.sidebarCard}>
            <h2 className={styles.dashboardTitle}>My Dashboard</h2>
            <nav className={styles.dashboardNav}>
              <div
                onClick={() => setCurrentSection("summary")}
                className={`${styles.navItem} ${currentSection === "summary" ? styles.active : ""}`}
              >
                <i className={`fas fa-home ${styles.navIcon}`} aria-hidden />
                <span>Summary</span>
              </div>
              <div
                onClick={() => setCurrentSection("trips")}
                className={`${styles.navItem} ${currentSection === "trips" ? styles.active : ""}`}
              >
                <i className={`fas fa-plane-departure ${styles.navIcon}`} aria-hidden />
                <span>Trips</span>
              </div>
              <div
                onClick={() => setCurrentSection("posts")}
                className={`${styles.navItem} ${currentSection === "posts" ? styles.active : ""}`}
              >
                <i className={`fas fa-newspaper ${styles.navIcon}`} aria-hidden />
                <span>Blog Posts</span>
              </div>
              <div
                onClick={() => setCurrentSection("favorites")}
                className={`${styles.navItem} ${currentSection === "favorites" ? styles.active : ""}`}
              >
                <i className={`fas fa-heart ${styles.navIcon}`} aria-hidden />
                <span>Favorites</span>
              </div>
              <div
                onClick={() => setCurrentSection("profile")}
                className={`${styles.navItem} ${currentSection === "profile" ? styles.active : ""}`}
              >
                <i className={`fas fa-user-edit ${styles.navIcon}`} aria-hidden />
                <span>My Profile</span>
              </div>
            </nav>
          </div>
        </aside>

        <main className={styles.main}>
          <div id="dashboard-content-area" className={styles.dashboardContent}>
            {currentSection === "summary" && renderSummary()}
            {currentSection === "trips" && renderTrips()}
            {currentSection === "profile" && (
              <div className={styles.profileCard}>
                <ProfileView />
              </div>
            )}
            {currentSection === "posts" && renderPosts()}
            {currentSection === "favorites" && renderFavorites()}
          </div>
        </main>
      </div>

      {showCreatePostModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCreatePostModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowCreatePostModal(false)}>
              ×
            </button>
            <h3 className={styles.modalTitle}>{newPost.id ? "Edit Post" : "Create Blog Post"}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError("");
                const title = (newPost.title || "").trim();
                const category = (newPost.category || "").trim();
                const content = (newPost.content || "").trim();
                if (!title) return setCreateError("Title is required");
                if (!content) return setCreateError("Content is required");
                setCreatingPost(true);
                try {
                  const token =
                    typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  const headers = { "Content-Type": "application/json" };
                  if (token) headers.Authorization = `Bearer ${token}`;

                  if (newPost && newPost.id) {
                    // edit
                    const res = await fetch(
                      `${API_URL}/api/blogposts/${encodeURIComponent(newPost.id)}`,
                      { method: "PUT", headers, body: JSON.stringify({ title, category, content }) }
                    );
                    if (res.ok) {
                      const parsed = await res.json().catch(() => null);
                      const updated = parsed?.data ||
                        parsed || { id: newPost.id, title, category, content };
                      setPosts((p) =>
                        Array.isArray(p)
                          ? p.map((x) => (String(x.id) === String(updated.id) ? updated : x))
                          : [updated]
                      );
                      setShowCreatePostModal(false);
                    } else {
                      // fallback local update
                      const updatedLocal = {
                        ...newPost,
                        title,
                        category,
                        content,
                        updated_at: new Date().toISOString(),
                        _local: true,
                      };
                      setPosts((p) =>
                        Array.isArray(p)
                          ? p.map((x) => (String(x.id) === String(newPost.id) ? updatedLocal : x))
                          : [updatedLocal]
                      );
                      setShowCreatePostModal(false);
                    }
                  } else {
                    const res = await fetch(`${API_URL}/api/blogposts`, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({ title, category, content }),
                    });
                    if (res.ok) {
                      const parsed = await res.json().catch(() => null);
                      const created = parsed?.data ||
                        parsed || { id: `local-${Date.now()}`, title, category, content };
                      const withAuthor = {
                        ...(created || {}),
                        author_name:
                          (user &&
                            (user.full_name ||
                              `${user.first_name || ""} ${user.last_name || ""}`.trim())) ||
                          created?.author_name ||
                          null,
                        author_profile_image:
                          (user && (user.profile_image || null)) ||
                          created?.author_profile_image ||
                          null,
                      };
                      setPosts((p) => [withAuthor, ...(Array.isArray(p) ? p : [])]);
                      setShowCreatePostModal(false);
                    } else {
                      // create local fallback
                      const localId = `local-${Date.now()}`;
                      const created = {
                        id: localId,
                        title,
                        category,
                        content,
                        user_id: user?.id || null,
                        created_at: new Date().toISOString(),
                        _local: true,
                        author_name:
                          (user &&
                            (user.full_name ||
                              `${user.first_name || ""} ${user.last_name || ""}`.trim())) ||
                          null,
                        author_profile_image: (user && (user.profile_image || null)) || null,
                      };
                      setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                      setShowCreatePostModal(false);
                    }
                  }
                } catch (err) {
                  const localId = `local-${Date.now()}`;
                  const created = {
                    id: localId,
                    title: newPost.title,
                    category: newPost.category,
                    content: newPost.content,
                    user_id: user?.id || null,
                    created_at: new Date().toISOString(),
                    _local: true,
                  };
                  setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                  setShowCreatePostModal(false);
                } finally {
                  setCreatingPost(false);
                }
              }}
            >
              <div className={styles.field}>
                <label>Title</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost((n) => ({ ...n, title: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input
                  value={newPost.category}
                  onChange={(e) => setNewPost((n) => ({ ...n, category: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((n) => ({ ...n, content: e.target.value }))}
                  rows={6}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingPost} className={styles.primary}>
                  {creatingPost ? "Saving…" : newPost.id ? "Save changes" : "Create post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
