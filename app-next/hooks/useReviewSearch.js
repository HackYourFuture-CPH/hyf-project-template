import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useReviewSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchReviews = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setHasSearched(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_URL}/api/admin/reviews?search=${encodeURIComponent(term)}&limit=20`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Error searching reviews:', error);
      setSearchError('Failed to search reviews. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchReviews(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchReviews]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    setHasSearched(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    clearSearch
  };
}
