"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRoom, getMessages, sendMessage } from "@/roomActions";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chat from "@/components/Chat";

export default function RoomPage() {
  const params = useParams();
  const { id } = params;

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoom(id);
        if (roomData) {
          setRoom(roomData);
          setVideoUrl(roomData.video_url);
        }
        const messagesData = await getMessages(id);
        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id]);

  const handleSendMessage = async (message) => {
    try {
      const userId = 5; // need to replace with actual user id
      await sendMessage(id, userId, message);
      const updatedMessages = [
        ...messages,
        { content: message, sender: "You" },
      ];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-6">
          Watch YouTube Videos Together
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="col-span-3 aspect-w-16 aspect-h-9">
            {videoUrl && (
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(
                  videoUrl
                )}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            )}
          </div>
          <div className="col-span-2 bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 h-full flex flex-col">
            <Chat messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const extractVideoId = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};
