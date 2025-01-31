import Link from "next/link"; 
import { link } from "node:fs";

export default function Features() {
  const features = [
    {
      title: "Create Room",
      description:
        "Start your own room to share and discuss YouTube videos with friends.",
      icon: "🏠",
      link: "/room",
    },
    {
      title: "Personalized Watchlist",
      description:
        "Save your favorite movies and create a personalized watchlist for later viewing",
      icon: "🎬",
      link: "/movies",
    },
    {
      title: "Advanced Filters",
      description:
        "Find exactly what you want with filters for genre, year, rating, and more",
      icon: "🔍",
      link: "/movies",
    },
    {
      title: "Movie Ratings",
      description:
        "See what others think and share your own ratings and reviews",
      icon: "⭐",
      link: "/movies",
    },
  ];

  return (
    <section className="grid md:grid-cols-4 gap-8 py-20">
      {features.map((feature, index) => {
        const content = (
          <div
            key={index}
            className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-6 text-center hover:bg-gray-700 transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        );

        
        return feature.link ? (
          <Link key={index} href={feature.link}>
            {content}
          </Link>
        ) : (
          content
        );
      })}
    </section>
  );
}
