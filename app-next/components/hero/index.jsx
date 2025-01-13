import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="py-20 text-center">
      <h2 className="text-5xl font-bold text-gray-300 mb-6">
        Discover Your Next Favorite Movie
      </h2>
      <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
        Explore thousands of movies, create your watchlist, rate films, and find
        hidden gems tailored to your taste.
      </p>
      <Link href="/movies">
        <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
          Explore Movies
        </Button>
      </Link>
    </main>
  );
}
