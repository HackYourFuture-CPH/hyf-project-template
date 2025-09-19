import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useTourSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setSearchError('');

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(
          `${API_URL}/api/admin/tours?search=${encodeURIComponent(term)}&limit=50`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data || []);
          setHasSearched(true);
        } else {
          const errorData = await response.json();
          setSearchError(errorData.error || 'Search failed');
          setSearchResults([]);
        }
      } catch (error) {
        setSearchError('Connection error');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Clear search results
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    setHasSearched(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    clearSearch
  };
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
