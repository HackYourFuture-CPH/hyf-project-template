"use client";

import AppLayoutContainer from "@/app/components/AppLayoutContainer";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Box,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import NotesAndQuotes from "@/app/components/NotesAndQuotes.jsx";
import Reviews from "@/app/components/Reviews.jsx";
import { useErrorModal } from "../../hooks/useErrorModal.js";
import ErrorModal from "../../components/ErrorModal.jsx";
import { useCallback } from "react";
import { debounce } from "lodash";

const BookDetails = () => {
  const { id } = useParams();
  const { showError, error, hideError } = useErrorModal();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  //const [error, setError] = useState(null);

  const handleOpenNotes = () => setShowNotes(true);
  const handleCloseNotes = () => setShowNotes(false);

  const handleOpenQuotes = () => setShowQuotes(true);
  const handleCloseQuotes = () => setShowQuotes(false);

  const handleErrorWithDebounce = useCallback(
    debounce((message, title, severity) => {
      showError(message, title, severity);
    }, 300),
    [showError]
  );

  const handleReviewSuccess = (response) => {
    console.log("Review added successfully:", response);
    showError("Review added successfully!", "Success", "success");
  };

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/books/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch book details");

        const data = await response.json();
        setBook(data);
      } catch (err) {
        handleErrorWithDebounce(
          "Could not load book details. Please try again later.",
          "Loading Error",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading book details...
        </Typography>
      </Box>
    );
  }

  // if (loading) return <p>Loading book details...</p>;
  // if (error) return <p>{error}</p>;
  return (
    <>
      <AppLayoutContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "start" },
            padding: "2rem",
            backgroundColor: "#f5ebeb",
            height: "auto",
            margin: { xs: "2% 5%", md: "2% 10%" },
            gap: { xs: "2rem", md: "0" },
          }}
        >
          <Box
            sx={{
              flex: { xs: "1", md: "3" },
              maxWidth: { xs: "100%", md: "20%" },
              textAlign: { xs: "center", md: "left" },
              position: "relative",
              width: "100%",
            }}
          >
            <CardMedia
              component="img"
              image={book.cover_image}
              alt={book.title}
              sx={{
                width: { xs: "70%", md: "100%" },
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                margin: { xs: "0 auto", md: "0" },
                opacity: book.is_fallback ? 0.2 : 1,
                position: "relative",
              }}
            />

            <Box sx={{ marginTop: "1rem" }}>
              <Reviews bookId={id} onSuccess={handleReviewSuccess} />
            </Box>
          </Box>

          <Box
            sx={{
              flex: { xs: "1", md: "2" },
              paddingLeft: { xs: "0", md: "2rem" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                marginBottom: "1rem",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {book.title}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                marginBottom: "0.5rem",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Author: {book.author}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                marginBottom: "1rem",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Genre: {book.genre}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                fontSize: { xs: "0.9rem", md: "1.2rem" },
                lineHeight: "1.6",
                paddingBottom: "2rem",
              }}
            >
              {book.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "1rem",
                marginTop: "1rem",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "16px", md: "20px" },
                  padding: "0.5rem 2rem",
                  borderRadius: "35px",
                  backgroundColor: "#D5B4B4",
                  "&:hover": {
                    backgroundColor: "#B49090",
                  },
                }}
                onClick={handleOpenQuotes}
              >
                Quotes
              </Button>

              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "16px", md: "20px" },
                  padding: "0.5rem 2rem",
                  borderRadius: "35px",
                  backgroundColor: "#D5B4B4",
                  "&:hover": {
                    backgroundColor: "#B49090",
                  },
                }}
                onClick={handleOpenNotes}
              >
                Notes
              </Button>
              <NotesAndQuotes
                open={showNotes}
                handleClose={handleCloseNotes}
                bookId={id}
                type="notes"
              />
              <NotesAndQuotes
                open={showQuotes}
                handleClose={handleCloseQuotes}
                bookId={id}
                type="quotes"
              />
            </Box>
          </Box>
        </Box>
      </AppLayoutContainer>
      <ErrorModal
        isOpen={error.isOpen}
        onClose={hideError}
        message={error.message}
        title={error.title}
        severity={error.severity}
      />
    </>
  );
};

export default BookDetails;
