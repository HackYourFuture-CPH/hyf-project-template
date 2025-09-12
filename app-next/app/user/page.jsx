"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./User.module.css";
import Card from "../../components/Card/Card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function UserPage() {
  // local UI state
  const [currentSection, setCurrentSection] = useState("summary");

  // fetched data
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteTours, setFavoriteTours] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handler to update favorites when a Card toggles favorite
  function handleFavoriteChange({ added, itemId }) {
    setFavorites((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      if (added) {
        if (!arr.find((f) => (f.itemId || f.item_id) === itemId)) {
          arr.push({ itemId, item_type: "tour" });
        }
      } else {
        const filtered = arr.filter((f) => (f.itemId || f.item_id) !== itemId);
        try {
          localStorage.setItem("favorites", JSON.stringify(filtered));
        } catch {}
        return filtered;
      }
      try {
        localStorage.setItem("favorites", JSON.stringify(arr));
      } catch {}
      return arr;
    });
  }

  // helper to safely parse JSON or return text
  async function safeParseResponse(res) {
    const text = await res.text();
    try {
      return { body: JSON.parse(text), raw: text };
    } catch {
      return { body: null, raw: text };
    }
  }

  // Resolve favorite items to tour objects using fetched `tours` and localStorage fallback
  useEffect(() => {
    let mounted = true;

    async function resolveFavoriteTours() {
      try {
        // prefer in-memory favorites (from server) but fallback to localStorage
        const saved = Array.isArray(favorites)
          ? favorites
          : JSON.parse(localStorage.getItem("favorites") || "[]");

        // collect candidate ids (support different shapes)
        const ids = [];
        for (const f of saved || []) {
          const type = f.item_type || f.type || f.itemType;
          const id = f.item_id || f.itemId || f.id;
          if (!id) continue;
          // if type is present, require 'tour'; otherwise allow and try to resolve from tours
          if (type && String(type).toLowerCase() !== "tour") continue;
          ids.push(String(id));
        }

        const uniq = [...new Set(ids)];
        if (uniq.length === 0) {
          if (mounted) setFavoriteTours([]);
          return;
        }

        const resolved = [];
        const missing = [];

        // match against already-fetched tours
        for (const id of uniq) {
          const found = tours.find((t) => String(t.id) === String(id));
          if (found) resolved.push(found);
          else missing.push(id);
        }

        // fetch any missing tours individually
        if (missing.length > 0) {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          for (const id of missing) {
            try {
              const res = await fetch(`${API_URL}/api/tours/${id}`, { headers });
              const parsed = await safeParseResponse(res);
              const tour = parsed.body?.data || parsed.body || null;
              if (tour) resolved.push(tour);
            } catch (err) {
              // ignore individual fetch errors
              console.debug("Failed to fetch favorite tour", id, err?.message || err);
            }
          }
        }

        if (mounted) setFavoriteTours(resolved);
      } catch (err) {
        console.debug("resolveFavoriteTours error:", err?.message || err);
        if (mounted) setFavoriteTours([]);
      }
    }

    resolveFavoriteTours();
    return () => {
      mounted = false;
    };
  }, [favorites, tours]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // 1) Profile
        try {
          const resProfile = await fetch(`${API_URL}/api/users/profile`, { headers });
          const parsed = await safeParseResponse(resProfile);
          if (resProfile.ok && parsed.body) {
            setUser(parsed.body.data || parsed.body);
          } else {
            console.debug("Profile fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Profile request error:", err.message);
        }

        // 2) Posts (fetch all, filter client-side by user later)
        try {
          const resPosts = await fetch(`${API_URL}/api/posts`, { headers });
          const parsed = await safeParseResponse(resPosts);
          if (resPosts.ok && parsed.body) {
            setPosts(parsed.body.data || parsed.body || []);
          } else {
            console.debug("Posts fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Posts request error:", err.message);
        }

        // 3) Tours (request larger page to include more items)
        try {
          const resTours = await fetch(`${API_URL}/api/tours?limit=100`, { headers });
          const parsed = await safeParseResponse(resTours);
          if (resTours.ok && parsed.body) {
            // backend returns { tours: [...] } or { data: [...] }
            setTours(parsed.body.tours || parsed.body.data || parsed.body || []);
          } else {
            console.debug("Tours fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Tours request error:", err.message);
        }

        // 4) Favorites - try server, fallback to localStorage
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
          } else {
            // fallback to localStorage
            const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (mounted) setFavorites(saved);
          }
        } catch (err) {
          console.debug("Favorites request error (may be unsupported):", err.message);
          const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
          if (mounted) setFavorites(saved);
        }
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

  // listen for global favorite events from Card components
  useEffect(() => {
    function onFav(e) {
      const { added, itemId } = e.detail || {};
      if (itemId) handleFavoriteChange({ added, itemId });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesChanged", onFav);
    }
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("favoritesChanged", onFav);
    };
  }, []);

  function renderSummary() {
    if (!user) {
      return (
        <div className={styles.profileCard}>
          <h2 className={styles.dashboardTitle}>Welcome!</h2>
          <p className={styles.empty}>Please log in to see your dashboard summary.</p>
        </div>
      );
    }

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

  function renderProfile() {
    if (loading) return <div className={styles.profileCard}>Loading profile…</div>;
    if (error) return <div className={styles.profileCard}>Error loading profile: {error}</div>;
    if (!user) {
      return (
        <div className={styles.profileCard}>
          <div className={styles.profileRow}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>?</div>
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>Guest</h3>
              <div className={styles.field}>Not signed in</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.profileCard}>
        <ProfileView />
      </div>
    );
  }

  // ProfileView component: shows view or edit mode
  function ProfileView() {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      mobile: user.mobile || "",
      profile_image: user.profile_image || "",
    });
    const [imagePreview, setImagePreview] = useState(user.profile_image || "");
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
      // keep form in sync if user changes (outer updates)
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        mobile: user.mobile || "",
        profile_image: user.profile_image || "",
      });
      setImagePreview(user.profile_image || "");
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

    const fileInputRef = useRef(null);

    function openFilePicker() {
      if (fileInputRef.current) fileInputRef.current.click();
    }

    function onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      // show local preview; actual upload endpoint will be available later
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        // store preview as profile_image for now; backend expects a URL later
        setForm((f) => ({ ...f, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }

    async function onSubmit(e) {
      e.preventDefault();
      setFormError("");
      // minimal validation
      // client-side validation to avoid server-side 400s
      const fname = (form.first_name || "").trim();
      const lname = (form.last_name || "").trim();
      const mobileVal = (form.mobile || "").trim();
      if (!fname) return setFormError("First name is required");
      if (fname.length < 2 || !/^[a-zA-Z\s]+$/.test(fname))
        return setFormError("First name must be at least 2 letters and contain only letters/spaces");
      if (!lname) return setFormError("Last name is required");
      if (lname.length < 2 || !/^[a-zA-Z\s]+$/.test(lname))
        return setFormError("Last name must be at least 2 letters and contain only letters/spaces");
      const mobilePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!mobileVal) return setFormError("Mobile number is required");
      if (!mobilePattern.test(mobileVal))
        return setFormError("Please enter a valid mobile number (10-15 digits, may include +, spaces, dashes or parentheses)");
      setSubmitting(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        // Build payload: only include profile_image if it's a http(s) URL.
        const payload = {
          first_name: fname,
          last_name: lname,
          mobile: mobileVal,
        };
        if (form.profile_image && typeof form.profile_image === "string") {
          const v = form.profile_image;
          if (v.startsWith("http://") || v.startsWith("https://")) {
            payload.profile_image = v;
          }
          // if it's a data: URL (preview), omit it until upload API is available
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
          // update outer user state with returned data
          setUser(parsed.data || parsed);
          setEditing(false);
        } else {
          console.debug("Profile update failed:", parsed);
          // Prefer Zod-style details array if present
          const details = parsed.details || parsed.errors || null;
          if (Array.isArray(details) && details.length > 0) {
            const msg = details.map((d) => (d.field ? `${d.field}: ${d.message}` : d.message)).join("; ");
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
      if (!current_password || !current_password.trim()) return setPwMessage("Current password is required");
      if (!new_password || new_password.length < 8) return setPwMessage("New password must be at least 8 characters");
      // enforce same rules as backend: lowercase, uppercase, digit, allowed chars
      if (!/[a-z]/.test(new_password)) return setPwMessage("New password must contain at least one lowercase letter");
      if (!/[A-Z]/.test(new_password)) return setPwMessage("New password must contain at least one uppercase letter");
      if (!/\d/.test(new_password)) return setPwMessage("New password must contain at least one number");
      if (!/^[a-zA-Z\d@$!%*?&]+$/.test(new_password)) return setPwMessage("New password contains invalid characters");
      if (new_password !== new_password_confirmation) return setPwMessage("New passwords do not match");

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
            const msg = details.map((d) => (d.field ? `${d.field}: ${d.message}` : d.message)).join("; ");
            setPwMessage(msg);
          } else {
            setPwMessage(parsed.message || parsed.error || "Failed to change password");
          }
          console.debug("Change password failed:", parsed);
        }
      } catch (err) {
        setPwMessage(err.message || "Failed to change password");
      } finally {
        setPwSubmitting(false);
      }
    }

    return (
      <div className={styles.profileRow}>
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
              {(user.full_name || user.first_name || user.username || "")[0]}
            </div>
          )}
          {editing ? (
            <div className={styles.avatarActions}>
              <button type="button" className={styles.uploadButton} onClick={openFilePicker}>
                Upload photo
              </button>
              <input
                ref={fileInputRef}
                className={styles.hiddenFileInput}
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
            </div>
          ) : null}
        </div>

        {/* upload button is inside avatarWrap so we don't duplicate it here */}

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
            {/* Toggle to show change-password form while editing */}
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
                {user.full_name ||
                  `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                  user.username}
              </h3>
              <div className={styles.field}>
                <strong>Username:</strong> {user.username || "—"}
              </div>
              <div className={styles.field}>
                <strong>Email:</strong> {user.email || "—"}
              </div>
              <div className={styles.field}>
                <strong>Mobile:</strong> {user.mobile || "—"}
              </div>

              <div className={styles.formActions}>
                <button onClick={() => setEditing(true)} className={styles.primary}>
                  Edit profile
                </button>
              </div>
            </div>
          )}
          {/* Change password inline form - only visible while editing */}
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
                  <button type="button" onClick={() => setChangingPassword(false)} className={styles.secondary}>
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
        <h3>My Posts</h3>
        {myPosts.length === 0 && <p className={styles.empty}>No posts yet.</p>}
        {myPosts.map((p) => (
          <div key={p.id} className={styles.postRow}>
            <div>{p.title}</div>
            <div className={styles.postMeta}>{p.category || p.tags?.join(", ") || "General"}</div>
          </div>
        ))}
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
    // We resolve favorite tours into full tour objects in `favoriteTours` state
    if (!Array.isArray(favoriteTours) || favoriteTours.length === 0) {
      return (
        <div className={styles.profileCard}>
          <h3>Favorites</h3>
          <p className={styles.empty}>No favorites yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.profileCard}>
        <h3>Favorites</h3>
        <div className={styles.cardGrid}>
          {favoriteTours.map((t) => (
            <div key={t.id} className={styles.cardWrapper}>
              <Card
                card={t}
                viewLink={`/tours/${t.id}`}
                onFavoriteChange={({ added, itemId }) => handleFavoriteChange({ added, itemId })}
              />
            </div>
          ))}
        </div>
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
                <span>Posts</span>
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
            {currentSection === "profile" && renderProfile()}
            {currentSection === "posts" && renderPosts()}
            {currentSection === "favorites" && renderFavorites()}
          </div>
        </main>
      </div>
    </main>
  );
}
