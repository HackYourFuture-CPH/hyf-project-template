"use client";

import AppLayoutContainer from "@/app/components/AppLayoutContainer";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Box, Grid2, CardMedia, Typography } from "@mui/material";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/books/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book details");

        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error(err);
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
          flexDirection: "row",
          alignItems: "start",
          padding: "2rem",
          backgroundColor: "#f5ebeb",
          height: "100vh",
          margin: "2% 5%",
        }}
      >
        {/* Book Image */}
        <Box sx={{ flex: "3", maxWidth: "20%" }}>
          <CardMedia
            component="img"
            image={book.cover_image}
            alt={book.title}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            }}
          />
        </Box>

        {/* Book Details */}
        <Box
          sx={{
            flex: "2",
            paddingLeft: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: "bold", marginBottom: "1rem" }}
          >
            {book.title}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ marginBottom: "0.5rem" }}
          >
            Author: {book.author}
          </Typography>
          <Typography variant="h6" component="p" sx={{ marginBottom: "1rem" }}>
            Genre: {book.genre}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ fontSize: "1.2rem", lineHeight: "1.8" }}
          >
            {book.description}
          </Typography>
        </Box>
      </Box>
    </AppLayoutContainer>
  );
};

export default BookDetails;
