import { notFound } from "next/navigation";
import { getRoom, getMessages } from "@/roomActions";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chat from "@/components/Chat";

export async function generateMetadata({ params }) {
  const room = await getRoom(params.id);
  if (!room) return { title: "Room Not Found" };

  return {
    title: `Room ${params.id}`,
  };
}

export default async function RoomPage({ params }) {
  const room = await getRoom(params.id);
  if (!room) {
    notFound();
  }

  const messages = await getMessages(params.id);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-300 mb-6">
          Watch YouTube Videos Together
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="col-span-3 aspect-w-16 aspect-h-9">
            {room.video_url && (
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(
                  room.video_url
                )}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            )}
          </div>
          <div className="col-span-2 bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 h-full flex flex-col">
            <Chat initialMessages={messages} roomId={params.id} />
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
