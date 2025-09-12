"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./User.module.css";
import Card from "../../components/Card/Card";
import BlogCard from "../../components/BlogCard/BlogCard";

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

  // Create post (modal) state
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "" });
  const [creatingPost, setCreatingPost] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  function closeCreateModal() {
    setShowCreatePostModal(false);
    setNewPost({ title: "", category: "", content: "" });
    setCreateError("");
  }

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

  // Fetch profile, posts, tours and favorites when component mounts
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
            if (mounted) setUser(parsed.body.data || parsed.body);
          } else {
            console.debug("Profile fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Profile request error:", err.message);
        }

        // 2) Posts (user blogposts)
        try {
          // Prefer the authenticated user's posts endpoint if available
          const resPosts = await fetch(`${API_URL}/api/blogposts/my-posts`, { headers });
          const parsed = await safeParseResponse(resPosts);
          if (resPosts.ok && parsed.body) {
            if (mounted) setPosts(parsed.body.data || parsed.body || []);
          } else {
            console.debug(
              "User posts fetch failed, falling back to public posts endpoint:",
              parsed.raw || parsed.body?.message
            );
            // try public blogposts list as a fallback
            try {
              const resAll = await fetch(`${API_URL}/api/blogposts`, { headers });
              const parsedAll = await safeParseResponse(resAll);
              if (resAll.ok && parsedAll.body) {
                if (mounted) setPosts(parsedAll.body.data || parsedAll.body || []);
              }
            } catch (err2) {
              console.debug("Fallback public posts fetch failed:", err2.message);
            }
          }
        } catch (err) {
          console.debug("Posts request error:", err.message);
        }

        // 3) Tours
        let fetchedTours = [];
        try {
          const resTours = await fetch(`${API_URL}/api/tours?limit=100`, { headers });
          const parsed = await safeParseResponse(resTours);
          if (resTours.ok && parsed.body) {
            fetchedTours = parsed.body.tours || parsed.body.data || parsed.body || [];
            if (mounted) setTours(fetchedTours);
          } else {
            console.debug("Tours fetch failed:", parsed.raw || parsed.body?.message);
          }
        } catch (err) {
          console.debug("Tours request error:", err.message);
        }

        // 4) Favorites
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
              // Resolve favorite tours into full tour objects using fetchedTours (fallback to state `tours`)
              const sourceTours = fetchedTours.length
                ? fetchedTours
                : Array.isArray(tours)
                  ? tours
                  : [];
              const resolved = (Array.isArray(favs) ? favs : [])
                .filter((f) => (f.item_type || f.itemType || f.type) === "tour")
                .map((f) => {
                  const id = String(f.item_id || f.itemId || f.item || f.itemId);
                  return sourceTours.find((t) => String(t.id) === id) || null;
                })
                .filter(Boolean);
              setFavoriteTours(resolved);
            }
          } else {
            const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (mounted) setFavorites(saved);
            // build favoriteTours from saved favorites
            const sourceTours = Array.isArray(tours) ? tours : [];
            const resolved = (Array.isArray(saved) ? saved : [])
              .filter((f) => (f.item_type || f.itemType || f.type) === "tour")
              .map((f) =>
                sourceTours.find(
                  (t) => String(t.id) === String(f.itemId || f.item_id || f.itemId || f.item)
                )
              )
              .filter(Boolean);
            setFavoriteTours(resolved);
          }
        } catch (err) {
          console.debug("Favorites request error (may be unsupported):", err.message);
          const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
          if (mounted) setFavorites(saved);
          const sourceTours = Array.isArray(tours) ? tours : [];
          const resolved = (Array.isArray(saved) ? saved : [])
            .filter((f) => (f.item_type || f.itemType || f.type) === "tour")
            .map((f) =>
              sourceTours.find(
                (t) => String(t.id) === String(f.itemId || f.item_id || f.itemId || f.item)
              )
            )
            .filter(Boolean);
          setFavoriteTours(resolved);
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

  // Recompute favoriteTours when favorites or tours change
  useEffect(() => {
    try {
      const favs = Array.isArray(favorites) ? favorites : [];
      const sourceTours = Array.isArray(tours) ? tours : [];
      const resolved = favs
        .filter((f) => (f.item_type || f.itemType || f.type) === "tour")
        .map((f) => {
          const id = String(f.item_id || f.itemId || f.item || f.itemId || "");
          return sourceTours.find((t) => String(t.id) === id) || null;
        })
        .filter(Boolean);
      setFavoriteTours(resolved);
    } catch (err) {
      console.debug("Error resolving favorite tours:", err?.message || err);
      setFavoriteTours([]);
    }
  }, [favorites, tours]);

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
        return setFormError(
          "First name must be at least 2 letters and contain only letters/spaces"
        );
      if (!lname) return setFormError("Last name is required");
      if (lname.length < 2 || !/^[a-zA-Z\s]+$/.test(lname))
        return setFormError("Last name must be at least 2 letters and contain only letters/spaces");
      const mobilePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!mobileVal) return setFormError("Mobile number is required");
      if (!mobilePattern.test(mobileVal))
        return setFormError(
          "Please enter a valid mobile number (10-15 digits, may include +, spaces, dashes or parentheses)"
        );
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
      // enforce same rules as backend: lowercase, uppercase, digit, allowed chars
      if (!/[a-z]/.test(new_password))
        return setPwMessage("New password must contain at least one lowercase letter");
      if (!/[A-Z]/.test(new_password))
        return setPwMessage("New password must contain at least one uppercase letter");
      if (!/\d/.test(new_password))
        return setPwMessage("New password must contain at least one number");
      if (!/^[a-zA-Z\d@$!%*?&]+$/.test(new_password))
        return setPwMessage("New password contains invalid characters");
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
                      // open edit modal
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
                      setDeleteError("");
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
                          // fallback: remove locally
                          setPosts((all) =>
                            Array.isArray(all) ? all.filter((x) => x.id !== p.id) : []
                          );
                          const text = await res.text();
                          try {
                            const parsed = JSON.parse(text);
                            setDeleteError(
                              parsed.message || parsed.error || "Failed to delete post"
                            );
                          } catch {
                            setDeleteError(text || "Failed to delete post");
                          }
                        }
                      } catch (err) {
                        // fallback removal
                        setPosts((all) =>
                          Array.isArray(all) ? all.filter((x) => x.id !== p.id) : []
                        );
                        setDeleteError(err.message || "Failed to delete post");
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
            {currentSection === "profile" && renderProfile()}
            {currentSection === "posts" && renderPosts()}
            {currentSection === "favorites" && renderFavorites()}
          </div>
        </main>
      </div>
      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className={styles.modalBackdrop} onClick={() => closeCreateModal()}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => closeCreateModal()}>
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

                  // If newPost has an id, we are editing -> use PUT
                  if (newPost && newPost.id) {
                    // If it's a local fallback post (no backend), update locally without calling server
                    if (String(newPost.id).startsWith("local-")) {
                      const updatedLocal = {
                        ...newPost,
                        title,
                        category,
                        content,
                        updated_at: new Date().toISOString(),
                      };
                      setPosts((p) =>
                        Array.isArray(p)
                          ? p.map((x) => (String(x.id) === String(newPost.id) ? updatedLocal : x))
                          : [updatedLocal]
                      );
                      setShowCreatePostModal(false);
                      setCreateError("");
                      return;
                    }

                    const res = await fetch(
                      `${API_URL}/api/blogposts/${encodeURIComponent(newPost.id)}`,
                      {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ title, category, content }),
                      }
                    );

                    const text = await res.text();
                    let parsed;
                    try {
                      parsed = JSON.parse(text);
                    } catch {
                      parsed = { message: text };
                    }

                    if (res.ok) {
                      const updated = parsed.data || parsed;
                      setPosts((p) =>
                        Array.isArray(p)
                          ? p.map((x) => (String(x.id) === String(updated.id) ? updated : x))
                          : [updated]
                      );
                      setShowCreatePostModal(false);
                      setCreateError("");
                    } else {
                      const contentType = res.headers.get("content-type") || "";
                      const isHtml =
                        (typeof parsed.message === "string" &&
                          parsed.message.toLowerCase().includes("<html")) ||
                        contentType.includes("text/html");
                      if (isHtml || res.status === 404) {
                        // Backend missing — treat as local update
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
                        setCreateError("");
                        console.warn(
                          "Updated local post fallback because PUT /api/blogposts/:id is unavailable",
                          parsed
                        );
                      } else {
                        const details = parsed.details || parsed.errors || null;
                        if (Array.isArray(details) && details.length > 0) {
                          const msg = details
                            .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
                            .join("; ");
                          setCreateError(msg);
                        } else {
                          setCreateError(parsed.message || parsed.error || "Failed to update post");
                        }
                      }
                    }
                  } else {
                    // Creating new post (POST)
                    const res = await fetch(`${API_URL}/api/blogposts`, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({ title, category, content }),
                    });

                    const text = await res.text();
                    let parsed;
                    try {
                      parsed = JSON.parse(text);
                    } catch {
                      parsed = { message: text };
                    }

                    if (res.ok) {
                      const created = parsed.data || parsed;
                      // prepend to posts state so it's visible immediately
                      setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                      setShowCreatePostModal(false);
                    } else {
                      // Detect HTML error page or missing route (e.g. "Cannot POST /api/posts")
                      const contentType = res.headers.get("content-type") || "";
                      const isHtml =
                        (typeof parsed.message === "string" &&
                          parsed.message.toLowerCase().includes("<html")) ||
                        contentType.includes("text/html") ||
                        (parsed.message && String(parsed.message).includes("Cannot POST"));
                      if (isHtml || res.status === 404) {
                        // Backend route not available — create a local post so it appears in the UI
                        const localId = `local-${Date.now()}`;
                        const created = {
                          id: localId,
                          title,
                          category,
                          content,
                          user_id: (user && (user.id || user.user_id)) || null,
                          created_at: new Date().toISOString(),
                          _local: true,
                        };
                        setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                        setShowCreatePostModal(false);
                        setCreateError("");
                        console.warn(
                          "Created local post fallback because POST /api/blogposts is unavailable",
                          parsed
                        );
                      } else {
                        const details = parsed.details || parsed.errors || null;
                        if (Array.isArray(details) && details.length > 0) {
                          const msg = details
                            .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
                            .join("; ");
                          setCreateError(msg);
                        } else {
                          setCreateError(parsed.message || parsed.error || "Failed to create post");
                        }
                      }
                    }
                  }
                } catch (err) {
                  // Network or other error — fallback to local creation so user sees the post
                  const localId = `local-${Date.now()}`;
                  const created = {
                    id: localId,
                    title,
                    category,
                    content,
                    user_id: (user && (user.id || user.user_id)) || null,
                    created_at: new Date().toISOString(),
                    _local: true,
                  };
                  setPosts((p) => [created, ...(Array.isArray(p) ? p : [])]);
                  setShowCreatePostModal(false);
                  setCreateError("");
                  console.warn(
                    "Created local post fallback due to error while creating post",
                    err?.message || err
                  );
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
                  onClick={() => closeCreateModal()}
                  className={styles.secondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={creatingPost} className={styles.primary}>
                  {newPost.id
                    ? creatingPost
                      ? "Saving…"
                      : "Save changes"
                    : creatingPost
                      ? "Creating…"
                      : "Create post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
