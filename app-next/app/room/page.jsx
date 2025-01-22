"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function WatchPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleStartWatch = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
    } else {
      alert("Invalid YouTube URL. Please enter a valid link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-6">
          Watch YouTube Videos Together
        </h1>
        <div className="max-w-lg mx-auto mb-6">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-4"
          />
          <Button
            onClick={handleStartWatch}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
          >
            Start Watching
          </Button>
        </div>
        {videoId && (
          <div className="aspect-w-16 h-screen aspect-h-9 mt-8">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
