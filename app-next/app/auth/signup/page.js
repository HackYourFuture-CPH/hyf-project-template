"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import styles from "./signup.module.css";

function normalizePhone(raw) {
  if (!raw) return "";
  let v = raw.trim();
  v = v.replace(/[\s\-()]/g, ""); // remove spaces, dashes, parentheses
  if (v.startsWith("00")) v = "+" + v.slice(2); // convert 00XX to +XX
  if (!v.startsWith("+") && /^\d+$/.test(v)) v = "+" + v; // if digits only, prepend +
  return v;
}

export default function SignupPage() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const email = session?.user?.email ?? "";

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const validate = () => {
    const errors = [];
    if (!fullName.trim()) errors.push("Full name is required.");
    const intl = normalizePhone(mobile);
    const re = /^\+\d{8,15}$/; // + and 8–15 digits
    if (!re.test(intl)) errors.push("Enter a valid international mobile number (e.g. +4512345678).");
    return { errors, intl };
  };

  const handleGoogle = async () => {
    setErr(""); setOk("");
    await signIn("google", { callbackUrl: "/auth/signup" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    const { errors, intl } = validate();
    if (errors.length) return setErr(errors.join(" "));

    try {
      setLoading(true);
      const res = await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, mobile: intl }),
      });
      if (!res.ok) throw new Error("Failed to save profile.");
      setOk("Your account details were saved.");
      setMobile(intl); // reflect normalized value
    } catch (e) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.signup}>
      <div className={styles["signup__container"]}>
        <div className={styles["signup__left"]}>
          <h1 className={styles["signup__heading"]}>Create your account</h1>
          <p className={styles["signup__lead"]}>
            Sign up with Google and then add your basic details.
          </p>

          <div className={styles["signup__image-wrap"]}>
            <img
              className={styles["signup__image"]}
              src="/images/pets-signup.png"
              alt="Cat and dog looking at a phone"
              loading="eager"
            />
          </div>
        </div>

        <div className={styles["signup__right"]}>
          <div className={styles["signup__form"]} role="form" aria-label="Sign up">
            {!isAuthed ? (
              <button
                type="button"
                onClick={handleGoogle}
                className={styles["signup__google"]}
              >
                <span className={styles["signup__google-icon"]}>
                  <img src="/icons/google.svg" alt="Google" />
                </span>
                Continue with Google
              </button>
            ) : (
              <>
                <div className={`${styles["signup__input"]} ${styles["signup__signedin"]}`}>
                  <span className={styles["signup__google-icon"]}>
                    <img src="/icons/google.svg" alt="Google" />
                  </span>
                  Signed in with Google
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className={styles["signup__field"]}>
                    <input
                      className={styles["signup__input"]}
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className={styles["signup__field"]}>
                    <input
                      className={styles["signup__input"]}
                      type="tel"
                      name="mobile"
                      placeholder="Mobile (e.g. +4512345678)"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      inputMode="tel"
                      pattern="^\+\d{8,15}$"
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles["signup__primary"]}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Create account"}
                  </button>
                </form>
              </>
            )}

            {err && <p className={styles["signup__error"]}>{err}</p>}
            {ok && <p className={styles["signup__ok"]}>{ok}</p>}

            <p className={styles["signup__terms"]}>
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
