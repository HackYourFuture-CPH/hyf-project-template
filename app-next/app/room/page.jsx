"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createRoom } from "@/roomActions";

export default function CreateRoomPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [roomId, setRoomId] = useState(null);

  const handleCreateRoom = async () => {
    if (!videoUrl) {
      alert("Please enter a YouTube URL.");
      return;
    }

    try {
      const room = await createRoom(videoUrl);
      if (room && room.id) {
        setRoomId(room.id);
        window.location.href = `/room/${room.id}`;
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-6">Create a Room</h1>
        <div className="max-w-lg mx-auto mb-6">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-4"
          />
          <Button
            onClick={handleCreateRoom}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full"
          >
            Create Room
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
