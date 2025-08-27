import styles from "./contact.module.css";
import pets from "./pets.png"; 

export const metadata = { title: "Contact | PetPass" };

export default function ContactPage() {
  return (
    <main className={styles.contact}>
      <header className={styles["contact__header"]}>
        <p className={styles["contact__eyebrow"]}>CONTACT</p>
        <h1 className={styles["contact__title"]}>How can we help you?</h1>
        <p className={styles["contact__lead"]}>
          You are welcome to contact us using the form on the right. We will reply as soon as possible.
        </p>
      </header>

      <section className={styles["contact__grid"]}>
        <div className={styles["contact__media"]}>
          <div className={styles["contact__social"]}>
            <p className={styles["contact__social-title"]}>OUR SOCIAL MEDIA</p>
            <ul className={styles["social__list"]} aria-label="Social media links">
              <li className={styles["social__item"]}>
                <a href="#" aria-label="Facebook" className={styles["social__link"]}>
                  {/* Facebook SVG */}
                  <svg viewBox="0 0 24 24" className={styles["social__icon"]} aria-hidden="true">
                    <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.42V9.66c0-2.39 1.42-3.71 3.6-3.71 1.04 0 2.12.18 2.12.18v2.34h-1.19c-1.17 0-1.54.73-1.54 1.48v1.77h2.63l-.42 2.9h-2.21v7.03c4.78-.79 8.44-4.94 8.44-9.94z" />
                  </svg>
                </a>
              </li>
              <li className={styles["social__item"]}>
                <a href="#" aria-label="LinkedIn" className={styles["social__link"]}>
                  {/* LinkedIn SVG */}
                  <svg viewBox="0 0 24 24" className={styles["social__icon"]} aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zm7 0h3.83v1.98h.05c.53-1.01 1.82-2.07 3.75-2.07 4 0 4.74 2.63 4.74 6.06V23h-4v-6.48c0-1.55-.03-3.55-2.17-3.55-2.17 0-2.5 1.7-2.5 3.45V23h-4V8.5z"/>
                  </svg>
                </a>
              </li>
              <li className={styles["social__item"]}>
                <a href="#" aria-label="Instagram" className={styles["social__link"]}>
                  {/* Instagram SVG */}
                  <svg viewBox="0 0 24 24" className={styles["social__icon"]} aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`${styles["contact__panel"]} ${styles["contact__panel--elevated"]}`}>
          <div className={styles["contact__pets-wrapper"]} aria-hidden="true">
            <img src={pets.src} alt="" className={styles["contact__pets"]} />
          </div>

          <form className={styles.form} action="#" method="post" noValidate>
            <div className={styles["form__field"]}>
              <label className={styles["form__label"]} htmlFor="name">Name</label>
              <input className={styles["form__input"]} id="name" name="name" type="text" placeholder="Name" required maxLength={80} />
            </div>

            <div className={styles["form__field"]}>
              <label className={styles["form__label"]} htmlFor="email">Email</label>
              <input className={styles["form__input"]} id="email" name="email" type="email" placeholder="Email" required />
            </div>

            <div className={styles["form__field"]}>
              <label className={styles["form__label"]} htmlFor="message">Notice</label>
              <textarea className={styles["form__textarea"]} id="message" name="message" placeholder="Notice" rows={6} required />
            </div>

            <div className={styles["form__actions"]}>
              <button className={`${styles.button} ${styles["button--primary"]}`} type="submit">Send</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
