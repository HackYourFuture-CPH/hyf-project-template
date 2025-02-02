"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Clock, Heart } from "lucide-react";
import { addToFavorites, removeFromFavorites, getFavorites } from "@/action";

const API_KEY = "8ec0629bf685d1704229f499278c23a5";
const API_URL = "https://api.themoviedb.org/3";

export default function ExplorePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = title
        ? `${API_URL}/search/movie`
        : `${API_URL}/discover/movie`;

      const params = new URLSearchParams({
        api_key: API_KEY,
        ...(title && { query: title }),
        ...(genre && { with_genres: genre }),
        ...(rating && { "vote_average.gte": rating }),
        ...(year && { primary_release_year: year }),
        ...(language && { with_original_language: language }),
        sort_by: "popularity.desc",
        page: currentPage,
      });

      const movieResponse = await axios.get(`${endpoint}?${params}`);
      setMovies(movieResponse.data.results);
      setTotalPages(movieResponse.data.total_pages);
    } catch (err) {
      setError("Error fetching movie data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies();
  };

  const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const [visiblePages] = useState(4);
    const pageNumbers = [];

    const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const handlePageChange = (page) => {
      onPageChange(page);
    };

    return (
      <div className="flex justify-center mt-8 mb-8">
        {currentPage > 1 && (
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gray-700 text-white px-4 py-2 mx-1"
          >
            Previous
          </Button>
        )}

        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`${
              currentPage === number ? "bg-blue-600" : "bg-gray-700"
            } text-white px-4 py-2 mx-1`}
          >
            {number}
          </Button>
        ))}

        {currentPage < totalPages && (
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-gray-700 text-white px-4 py-2 mx-1"
          >
            Next
          </Button>
        )}
      </div>
    );
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `${API_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
      );
      setMovieDetails(response.data);
    } catch (err) {
      console.error("Error fetching movie details:", err);
    }
  };

  const toggleFavorite = async (movieId) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(movieId);
      return isFavorite
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];
    });

    try {
      if (favorites.includes(movieId)) {
        const result = await removeFromFavorites(movieId);
        if (!result.success) {
          throw new Error(result.message);
        }
      } else {
        const result = await addToFavorites(movieId);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      window.location.href = "/login";
      
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await getFavorites();
        if (result.success) {
          setFavorites(result.favorites.map((movie) => movie.id));
        } else {
          console.warn(result.message || "Failed to fetch favorites.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchMovies();
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      fetchMovieDetails(selectedMovie);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedMovie]);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Explore Movies</h1>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2 text-white"
            >
              <SlidersHorizontal className="h-4 w-4 text-white" />
              Filters
            </Button>
          </div>

          <div
            className={`fixed inset-y-0 right-0 w-80 bg-gray-900 p-6 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showFilters ? "translate-x-0" : "translate-x-full"
            } z-50`}
          >
            <div className="flex justify-between items-center mb-6 ">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={fetchMovies} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Movie Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Search by title"
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Genres</option>
                  <option value="28">Action</option>
                  <option value="12">Adventure</option>
                  <option value="16">Animation</option>
                  <option value="35">Comedy</option>
                  <option value="80">Crime</option>
                  <option value="99">Documentary</option>
                  <option value="18">Drama</option>
                  <option value="10751">Family</option>
                  <option value="14">Fantasy</option>
                  <option value="36">History</option>
                  <option value="27">Horror</option>
                  <option value="10402">Music</option>
                  <option value="9648">Mystery</option>
                  <option value="10749">Romance</option>
                  <option value="878">Science Fiction</option>
                  <option value="53">Thriller</option>
                  <option value="10752">War</option>
                  <option value="37">Western</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Minimum Rating</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="1-10"
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Release Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Year"
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Languages</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ru">Russian</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading}
                onClick={() => setShowFilters(false)}
              >
                {loading ? "Searching..." : "Apply Filters"}
              </Button>
            </form>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-8">{error}</div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => setSelectedMovie(movie.id)}
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
                      favorites.includes(movie.id)
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } flex items-center justify-center gap-2 text-white`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(movie.id) ? "fill-current" : ""
                      }`}
                    />
                    {favorites.includes(movie.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {movies.length === 0 && !loading && !error && (
            <div className="text-center text-gray-400 mt-8">
              No movies found. Try adjusting your filters.
            </div>
          )}

          {selectedMovie && movieDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="fixed top-4 right-4 text-white bg-blue-600  rounded-full p-2 hover:bg-opacity-75 z-20"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="relative">
                  {movieDetails.backdrop_path && (
                    <div className="w-full h-[300px] relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                      <img
                        src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                        alt={movieDetails.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                        alt={movieDetails.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {movieDetails.title}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-400 mb-4">
                        <span>
                          {new Date(movieDetails.release_date).getFullYear()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatRuntime(movieDetails.runtime)}
                        </span>
                        <span>•</span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded">
                          ⭐ {movieDetails.vote_average.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {movieDetails.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-300 mb-6">
                        {movieDetails.overview}
                      </p>

                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Cast
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {movieDetails.credits.cast
                            .slice(0, 5)
                            .map((actor) => (
                              <div key={actor.id} className="text-center">
                                {actor.profile_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                    alt={actor.name}
                                    className="w-20 h-20 rounded-full object-cover mb-2"
                                  />
                                ) : (
                                  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                                    <span className="text-2xl text-gray-500">
                                      ?
                                    </span>
                                  </div>
                                )}
                                <p className="text-white text-sm">
                                  {actor.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {actor.character}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => toggleFavorite(movieDetails.id)}
                        className={`w-full md:w-auto ${
                          favorites.includes(movieDetails.id)
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            favorites.includes(movieDetails.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        {favorites.includes(movieDetails.id)
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}