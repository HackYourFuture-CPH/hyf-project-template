"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createRoom } from "@/roomActions";
import { Youtube, Users, MessageCircle } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-gray-800">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-12">
          Create a Room
        </h1>

        <div className="max-w-lg mx-auto mb-12">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-4"
          />
          <Button
            onClick={handleCreateRoom}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full text-lg py-6"
          >
            Create Room
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-300 mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
              <Youtube className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Add Video
              </h3>
              <p className="text-gray-300">
                Insert the YouTube URL of the video you want to watch together
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Join Room
              </h3>
              <p className="text-gray-300">
                You'll be redirected to a private room where you can invite
                friends
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Watch & Chat
              </h3>
              <p className="text-gray-300">
                Enjoy watching and chatting with your friends in real-time
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
