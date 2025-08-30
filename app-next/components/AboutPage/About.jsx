"use client";
import React from "react";
import styles from "./About.module.css";
import Link from "next/link";
import {
  Rocket,
  Gem,
  Star,
  UserCheck,
  MessageSquareText,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

const About = () => {
  const aboutSection = [
    {
      title: "Who We Are",
      content:
        "Welcome to CareConnect, your trusted partner in finding the best care services.",
      icon: <Star className={styles.icon} />,
    },
    {
      title: "Our Mission",
      content:
        "Our mission is to provide a seamless and reliable platform for discovering, connecting individuals and families with professional and compassionate caregivers. We believe in Humanity and sharing it.",
      icon: <Rocket className={styles.icon} />,
    },
    {
      title: "Our Vision",
      content:
        "To be the leading online platform for care services, recognized for our commitment to quality, trust, and customer satisfaction. We envision a world where everyone can easily find the care they need to live healthy and fulfilling lives.",
      icon: <Gem className={styles.icon} />,
    },
    {
      title: "Our Values",
      content:
        "At CareConnect, we are guided by our core values of integrity, compassion, excellence, and innovation. We strive to uphold these values in everything we do, from the services we offer to the way we interact with our customers and partners.",
      icon: <UserCheck className={styles.icon} />,
    },
    {
      title: "Why Choose CareConnect?",
      content:
        "Choosing CareConnect means choosing a platform that prioritizes your needs and preferences. We offer a user-friendly interface, comprehensive search options, and access to a wide range of care providers. Our team is dedicated to ensuring that you have a positive experience every step of the way.",
      icon: <BadgeCheck className={styles.icon} />,
    },
    
  ];

  // State and handlers for the contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>About Us</h1>
      <div className={styles.grid}>
        {aboutSection.map((section, index) => (
          <div key={index} className={styles.card}>
            {section.icon}
            <h2 className={styles.cardTitle}>{section.title}</h2>
            <p className={styles.content}>{section.content}</p>
          </div>
        ))}
      </div>

      {/* Get in Touch Form Section */}
      <div className={styles.formSection}>
        <MessageSquareText className={styles.icon} />
        <h2 className={styles.title}>Get in Touch</h2>
        <p className={styles.formDescription}>
          We would love to hear from you! Whether you have questions, feedback,
          or need assistance, our customer support team is here to help. Contact
          us today and let us assist you in finding the perfect solution.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={styles.textarea}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>

      <div className={styles.backLink}>
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  );
};

export default About;
