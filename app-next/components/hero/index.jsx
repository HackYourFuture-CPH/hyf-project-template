import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="py-20 text-center">
      <h2 className="text-5xl font-bold text-gray-300 mb-6">
        Watch Together, Anywhere
      </h2>
      <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
        Create a room, invite friends, and enjoy watching videos, movies, and sharing screens together in real-time.
      </p>
      <Link href="/create-room">
        <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
          Create Room
        </Button>
      </Link>
    </main>
  );
}