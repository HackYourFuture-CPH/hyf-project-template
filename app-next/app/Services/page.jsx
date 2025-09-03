"use client";
import Link from "next/link";
import { Heart, Users, Smartphone, Utensils, Car, Home } from "lucide-react";
import styles from "./services.module.css";
import { useAuthStore } from "@/store/useAuthStore";

export default function ServicesPage() {
  const services = [
    {
      title: "Personal Care Support",
      description:
        "Extra help with daily routines like dressing, bathing, or mobility beyond kommune SOSU services.",
      icon: <Heart className={styles.icon} />,
    },
    {
      title: "Companionship & Social Visits",
      description:
        "Friendly visits, conversations, reading, or walks to reduce loneliness and improve wellbeing.",
      icon: <Users className={styles.icon} />,
    },
    {
      title: "Digital Assistance",
      description:
        "Support with smartphones, tablets, NemID/MitID, e-Boks, online doctor appointments, and more.",
      icon: <Smartphone className={styles.icon} />,
    },
    {
      title: "Healthy Living & Meals",
      description:
        "Help preparing healthy meals, light exercise, or hobbies like gardening, knitting, and music.",
      icon: <Utensils className={styles.icon} />,
    },
    {
      title: "Transport & Errands",
      description:
        "Accompaniment to hospital visits, shopping, hairdresser, or community events.",
      icon: <Car className={styles.icon} />,
    },
    {
      title: "Family & Caregiver Support",
      description:
        "Short-term relief for family caregivers, or emergency backup when kommune helpers are delayed.",
      icon: <Home className={styles.icon} />,
    },
  ];

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Our Services</h1>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <div key={index} className={styles.card}>
            {service.icon}
            <h2 className={styles.cardTitle}>{service.title}</h2>
            <p className={styles.cardDescription}>{service.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.backLink}>
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  );
}
