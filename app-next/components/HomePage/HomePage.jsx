import Link from "next/link";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <h1>CareConnect</h1>
          <p>Connecting elderly people with helpers in their community</p>
          <div className={styles["button-group"]}>
            <Link
              href="/volunteers"
              className={`${styles.button} ${styles.request}`}
            >
              Volunteers
            </Link>
            <Link
              href="/offer-help"
              className={`${styles.button} ${styles.offer}`}
            >
              Offer Help
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles["feature-card"]}>
          <h3>Request Assistance</h3>
          <p>
            Elderly people can request help for groceries, transportation, or
            daily needs.
          </p>
        </div>
        <div className={styles["feature-card"]}>
          <h3>Offer Help</h3>
          <p>
            Volunteers and caregivers can provide support to those who need it.
          </p>
        </div>
        <div className={styles["feature-card"]}>
          <h3>Community Support</h3>
          <p>
            Build meaningful connections and strengthen the local community.
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} CareConnect. All rights reserved.
      </footer>
    </div>
  );
}
