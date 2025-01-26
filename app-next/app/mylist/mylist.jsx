import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function MyList() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("movieFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (movieId) => {
    const updatedFavorites = favorites.filter((id) => id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem("movieFavorites", JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        No favorite movies yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Favorite Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((movieId) => (
          <div
            key={movieId}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative pb-[150%]">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieId}`}
                alt="Favorite Movie"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white line-clamp-1">
                  Movie Title Placeholder
                </h3>
                <Button
                  onClick={() => removeFavorite(movieId)}
                  variant="outline"
                  className="text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
