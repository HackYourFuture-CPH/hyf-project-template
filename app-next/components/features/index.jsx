export default function Features() {
  const features = [
    {
      title: "Watch YouTube Videos",
      description: "Stream YouTube videos synchronously with your friends",
      icon: "🎥"
    },
    {
      title: "Share Your Screen",
      description: "Share your screen with room participants in real-time",
      icon: "🖥️"
    },
    {
      title: "Upload Local Files",
      description: "Upload and watch local video files together",
      icon: "📁"
    }
  ];

  return (
    <section className="grid md:grid-cols-3 gap-8 py-20">
      {features.map((feature, index) => (
        <div key={index} className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-blue-400 mb-2">{feature.title}</h3>
          <p className="text-gray-300">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}