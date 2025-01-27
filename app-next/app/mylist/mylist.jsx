"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getFavorites, removeFromFavorites } from "@/action";

export default function MyList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const result = await getFavorites();
        if (result.success) {
          setFavorites(result.favorites);
        } else {
          console.warn(result.message || "Failed to fetch favorites.");
        }
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (movieId) => {
    try {
      const isFavorite = favorites.some((movie) => movie.id === movieId);

      if (isFavorite) {
        const updatedFavorites = favorites.filter(
          (movie) => movie.id !== movieId
        );
        setFavorites(updatedFavorites);

        const result = await removeFromFavorites(movieId);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Failed to update favorites. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 mt-8">Loading...</div>;
  }

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
        {favorites.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            <div className="relative pb-[150%]">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x750?text=No+Image";
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white line-clamp-1">
                  {movie.title}
                </h3>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                {new Date(movie.release_date).getFullYear()}
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie.id);
                }}
                className={`mx-auto py-0.5 px-3 text-sm rounded-md ${
                  favorites.some((fav) => fav.id === movie.id)
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } flex items-center justify-center gap-2 text-white`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    favorites.some((fav) => fav.id === movie.id)
                      ? "fill-current"
                      : ""
                  }`}
                />
                {favorites.some((fav) => fav.id === movie.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
