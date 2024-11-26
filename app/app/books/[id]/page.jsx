"use client";

import AppLayoutContainer from "@/app/components/AppLayoutContainer";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Box, CardMedia, Typography, Button } from "@mui/material";
import Notes from "@/app/components/Notes.jsx";
import Reviews from "@/app/components/Reviews.jsx";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

  const handleOpenNotes = () => setShowNotes(true);
  const handleCloseNotes = () => setShowNotes(false);

  const handleOpenQuotes = () => setShowQuotes(true);
  const handleCloseQuotes = () => setShowQuotes(false);

  const handleReviewSuccess = (response) => {
    console.log("Review added successfully:", response);
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
        setError("Could not load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

  return (
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
            <Notes
              open={showNotes}
              handleClose={handleCloseNotes}
              bookId={id}
              type="notes"
            />
            <Notes
              open={showQuotes}
              handleClose={handleCloseQuotes}
              bookId={id}
              type="quotes"
            />
          </Box>
        </Box>
      </Box>
    </AppLayoutContainer>
  );
};

export default BookDetails;
