"use client";
import React, { useState } from "react";
import axios from "axios";

const API_KEY = "8ec0629bf685d1704229f499278c23a5";
const API_URL = "https://api.themoviedb.org/3";

const SuggestForm = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [popularity, setPopularity] = useState("");
  const [language, setLanguage] = useState("");
  const [runtimeMax, setRuntimeMax] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const handleRatingChange = (e) => setRating(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handlePopularityChange = (e) => setPopularity(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleRuntimeMaxChange = (e) => setRuntimeMax(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleGenreChange = (e) => setGenre(e.target.value);

  const fetchMovies = async (e) => {
    e.preventDefault();
    setError("");
    setMovies([]);

    try {
      const movieResponse = await axios.get(
        `${API_URL}/discover/movie?api_key=${API_KEY}&query=${title}&with_genres=${genre}&vote_average.gte=${rating}&primary_release_year=${year}&sort_by=popularity.desc&with_original_language=${language}&with_runtime.lte=${runtimeMax}`
      );
      setMovies(movieResponse.data.results.slice(0, 5));
    } catch (err) {
      setError("Error fetching movie data.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Movie Recommender</h1>

      <form onSubmit={fetchMovies} className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter a movie title"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
        />
        <input
          type="text"
          value={genre}
          onChange={handleGenreChange}
          placeholder="Enter a genre (e.g., Action)"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
        />
        <input
          type="number"
          value={rating}
          onChange={handleRatingChange}
          placeholder="Minimum rating (1-10)"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
          min="1"
          max="10"
        />
        <input
          type="text"
          value={year}
          onChange={handleYearChange}
          placeholder="Release Year"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
        />
        <input
          type="number"
          value={popularity}
          onChange={handlePopularityChange}
          placeholder="Minimum Popularity"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
          min="0"
          max="500"
        />
        <input
          type="text"
          value={language}
          onChange={handleLanguageChange}
          placeholder="Language (e.g., English, Spanish)"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
        />
        <input
          type="number"
          value={runtimeMax}
          onChange={handleRuntimeMaxChange}
          placeholder="Maximum Runtime (minutes)"
          className="p-3 rounded-lg border border-gray-700 text-black w-80"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 px-6 py-2 rounded-lg font-semibold text-white transition"
        >
          Get Recommendations
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8 w-full flex flex-wrap justify-center gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="max-w-xs bg-gray-800 rounded-lg p-4 text-center shadow-lg"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-4">{movie.title}</h3>
            <p className="text-sm mt-2">{movie.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestForm;
