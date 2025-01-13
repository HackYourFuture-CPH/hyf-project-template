export default function Features() {
  const features = [
    {
      title: "Personalized Watchlist",
      description:
        "Save your favorite movies and create a personalized watchlist for later viewing",
      icon: "🎬",
    },
    {
      title: "Advanced Filters",
      description:
        "Find exactly what you want with filters for genre, year, rating, and more",
      icon: "🔍",
    },
    {
      title: "Movie Ratings",
      description:
        "See what others think and share your own ratings and reviews",
      icon: "⭐",
    },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-8 py-20">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-6 text-center"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-300">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
