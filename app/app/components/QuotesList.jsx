import { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import styles from "./QuotesList.module.css";

const QuotesList = ({ userId }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quoteToRemove, setQuoteToRemove] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setQuotes(response.data.quotes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError("Error fetching quotes. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [userId]);

  const handleRemoveQuote = async (quoteId) => {
    if (!quoteId) {
      setError("Invalid quote ID.");
      return;
    }
    setQuoteToRemove(quoteId);
    setIsConfirmModalOpen(true);
  };
  const confirmRemoveQuote = async () => {
    if (!quoteToRemove) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/${quoteToRemove}`,
        {
          withCredentials: true,
        }
      );
      // Remove the deleted quote from the local state
      setQuotes((prevQuotes) =>
        prevQuotes.filter((quote) => quote.quote_id !== quoteToRemove)
      );
    } catch (err) {
      console.error("Error removing quote:", err);
      setError("Failed to remove quote. Please try again.");
    } finally {
      setIsConfirmModalOpen(false);
      setQuoteToRemove(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
      <div className={styles.QuotesList}>
        <h2>Recent Quotes</h2>
        {quotes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No quotes available yet!</p>
            <p>
              Add your favorite quotes by clicking on a book in your bookshelf
              and saving a quote.
            </p>
          </div>
        ) : (
          <ul>
            {quotes.map((quote, index) => (
              <li key={quote.quote_id || index} className={styles.quoteItem}>
                <blockquote>
                  <p>"{quote.quote_text}"</p>
                  <div>- {quote.book_author || "Unknown"} </div>
                  <div>{quote.book_title || "Unknown Book"}</div>
                </blockquote>
                <button
                  className={styles.closeButton}
                  onClick={() => handleRemoveQuote(quote.quote_id)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setQuoteToRemove(null);
        }}
        onConfirm={confirmRemoveQuote}
        message="Are you sure you want to delete this quote?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
export default QuotesList;
