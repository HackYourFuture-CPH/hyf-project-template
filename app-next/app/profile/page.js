"use client";

import { useState } from "react";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    petCategory: "dog",
    petName: "",
    moreInfo: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address";

    const dkPhoneRegex = /^\+45\d{8}$/;
    if (!dkPhoneRegex.test(form.phone)) newErrors.phone = "Phone must start with +45 and have exactly 8 digits";

    if (!form.petName.trim()) newErrors.petName = "Pet name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Form submitted:", form);
    alert("Thanks! We received your info.");
  };

  return (
    <section className={styles.profile}>
      <div className={styles["profile__container"]}>
        <div className={styles["profile__left"]}>
          <h1 className={styles["profile__heading"]}>
            Keep all your pet details in one profile
          </h1>
          <p className={styles["profile__lead"]}>
            Store essential info about you and your pet in a single place — simple,
            private, and ready whenever you need it. From contact details to your
            pet’s basics, everything stays tidy and accessible.
          </p>

          <div className={styles["profile__image-wrap"]}>
            <img
              className={styles["profile__image"]}
              src="/images/pets-profile.png"
              alt="Cat and dog in pastel hoodies looking at a phone"
              loading="eager"
            />
          </div>
        </div>

        <div className={styles["profile__right"]}>
          <form className={styles["profile__form"]} onSubmit={handleSubmit} noValidate>
            <input
              className={styles["profile__input"]}
              type="text"
              name="fullName"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <p className={styles["profile__error"]}>{errors.fullName}</p>}

            <input
              className={styles["profile__input"]}
              type="tel"
              name="phone"
              placeholder="Mobile number (e.g. +4512345678)"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className={styles["profile__error"]}>{errors.phone}</p>}

            <input
              className={styles["profile__input"]}
              type="email"
              name="email"
              placeholder="Email (e.g. example@mail.com)"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className={styles["profile__error"]}>{errors.email}</p>}

            <label className={styles["profile__label"]}>Pet information</label>

            <input
              className={styles["profile__input"]}
              type="text"
              name="petName"
              placeholder="Pet name"
              value={form.petName}
              onChange={handleChange}
              aria-invalid={!!errors.petName}
            />
            {errors.petName && <p className={styles["profile__error"]}>{errors.petName}</p>}

            <select
              className={styles["profile__select"]}
              name="petCategory"
              value={form.petCategory}
              onChange={handleChange}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="fish">Fish</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
            </select>

            <label className={styles["profile__check"]}>
              <input
                type="checkbox"
                name="moreInfo"
                checked={form.moreInfo}
                onChange={handleChange}
              />
              <span>Yes, I’d like to receive occasional tips & updates</span>
            </label>

            <button type="submit" className={styles["profile__button"]}>
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
