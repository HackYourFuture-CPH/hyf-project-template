"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter(); // Initialize the router
  const { login } = useAuth(); // Use Login from Auth context

  // Validate form fields
  const isValid = () => {
    let valid = true;
    const tempErrors = { username: "", password: "" };

    if (!username) {
      tempErrors.username = "Username is required";
      valid = false;
    }
    if (!password) {
      tempErrors.password = "Password is required";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const loginUser = async (username, password) => {
    try {
      const userData = { username, password };
      await login(userData); // Login through Auth context
      router.push(`/dashboard`); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message || "Something went wrong, please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid()) {
      loginUser(username, password);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#E4D0D0"
      padding={3}
    >
      {/* Left Side: Book Stack Image */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex={1}
        sx={{
          backgroundImage: 'url("https://pngimg.com/d/book_PNG51081.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height: "70vh",
          maxWidth: "400px",
          marginBottom: { xs: 2, md: 0 }, // Add spacing for mobile view
        }}
      />

      {/* Right Side: Form Container */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        bgcolor="#fdf3e2"
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
            color: "#5A4A42",
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
            error={!!errors.username}
            helperText={errors.username}
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
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
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
            disabled={!username || !password} // Disable button if fields are empty
            sx={{
              mt: 2,
              borderRadius: "10px",
              bgcolor: username && password ? "#FFB74D" : "#D5B4B4", // Bright orange when enabled
              color: "#ffffff",
              ":hover": {
                bgcolor: username && password ? "#FF8A00" : "#D5B4B4", // Brighter hover when enabled
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

        {/* Back Home Button */}
        <Button
          variant="text"
          sx={{ mt: 2, color: "#5A4A42" }}
          onClick={() => router.push("/")} // Redirect to homepage
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
