import Image from "next/image";
import "./contact.module.css";

export const metadata = { title: "Contact |  PetPass" };

export default function ContactPage() {
  return (
    <main className="contact">
      <div className="contact__bg" aria-hidden="true" />
      <header className="contact__header">
        <p className="contact__eyebrow">CONTACT</p>
        <h1 className="contact__title">How can we help you?</h1>
        <p className="contact__lead">
          You are welcome to contact us using the form on the right. We will reply as soon as possible.
        </p>
      </header>

      <section className="contact__grid">
        <div className="contact__media">
          <div className="contact__media-figure">
            <Image
              className="contact__pets"
              src="/contact/pets.png"
              alt="A cat and a husky"
              width={520}
              height={420}
              priority
            />
          </div>

          <div className="contact__social">
            <p className="contact__social-title">OUR SOCIAL MEDIA</p>
            <ul className="social__list" aria-label="Social media links">
              <li className="social__item"><a className="social__link" href="#" aria-label="Facebook" /></li>
              <li className="social__item"><a className="social__link" href="#" aria-label="LinkedIn" /></li>
              <li className="social__item"><a className="social__link" href="#" aria-label="Instagram" /></li>
            </ul>
          </div>
        </div>

        <div className="contact__panel contact__panel--elevated">
          <form className="form" action="#" method="post" noValidate>
            <div className="form__field">
              <label className="form__label" htmlFor="name">Name</label>
              <input className="form__input" id="name" name="name" type="text" placeholder="Name" required maxLength={80} />
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="email">Email</label>
              <input className="form__input" id="email" name="email" type="email" placeholder="Email" required />
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="message">Notice</label>
              <textarea className="form__textarea" id="message" name="message" placeholder="Notice" rows={6} required />
            </div>

            <div className="form__actions">
              <button className="button button--primary" type="submit">Send</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
