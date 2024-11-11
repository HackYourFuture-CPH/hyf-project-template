"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#87CEEB" // Warm, parchment-like background color
      padding={3}
    >
      {/* Left Side: Book Stack Image */}
      <Box
        display={{ xs: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        flex={1}
        sx={{
          backgroundImage: 'url("https://pngimg.com/d/book_PNG51081.png")', // Add your book image here
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height: "70vh",
          maxWidth: "400px",
        }}
      />

      {/* Right Side: Form Container */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        bgcolor="#fdf3e2" // Soft, paper-like background
        borderRadius={3}
        boxShadow={5}
        padding={5}
        width="100%"
        maxWidth={500}
      >
        {/* Welcome Message */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
            mb: 2,
            color: "#5A4A42", // Dark brown, bookish color
          }}
        >
          Welcome to LeafNotes
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Track what you've read and what's next in your literary journey.
        </Typography>

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={3}
          width="100%"
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "#fffbe8", // Off-white, parchment look
                color: "#3E2723", // Dark brown text
              },
              "& .MuiInputLabel-root": {
                color: "#5A4A42",
                fontFamily: "serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5A4A42", // Border color to match theme
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "#fffbe8",
                color: "#3E2723",
              },
              "& .MuiInputLabel-root": {
                color: "#5A4A42",
                fontFamily: "serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5A4A42",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: "10px",
              bgcolor: "#8B5E3C", // Warm brown button
              color: "#FFFFFF",
              ":hover": {
                bgcolor: "#5A4A42", // Darker brown on hover
              },
              fontFamily: "serif",
            }}
          >
            Login
          </Button>
        </Box>

        {/* Sign Up Link */}
        <Typography variant="body2" sx={{ mt: 2, color: "#5A4A42" }}>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" color="inherit">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
