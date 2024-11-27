"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext"; // Access Theme Context

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter();
  const { login } = useAuth();
  const { theme } = useTheme(); // Access theme

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
      await login(userData);
      router.push(`/dashboard`);
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
      bgcolor={theme === "dark" ? "var(--background-dark)" : "#E4D0D0"}
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
          marginBottom: { xs: 2, md: 0 },
        }}
      />

      {/* Right Side: Form Container */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        bgcolor={theme === "dark" ? "var(--form-bg-dark)" : "#fdf3e2"}
        borderRadius={3}
        boxShadow={5}
        padding={5}
        width="100%"
        maxWidth={500}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
            mb: 2,
            color: theme === "dark" ? "#ffffff" : "#5A4A42",
          }}
        >
          Welcome to LeafNotes
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          sx={{ color: theme === "dark" ? "#cccccc" : "inherit" }}
        >
          Track what you've read and what's next in your literary journey.
        </Typography>

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
                bgcolor: theme === "dark" ? "#333333" : "#fffbe8",
                color: theme === "dark" ? "#ffffff" : "#3E2723",
              },
              "& .MuiInputLabel-root": {
                color: theme === "dark" ? "#bbbbbb" : "#5A4A42",
                fontFamily: "serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme === "dark" ? "#444444" : "#5A4A42",
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
                bgcolor: theme === "dark" ? "#333333" : "#fffbe8",
                color: theme === "dark" ? "#ffffff" : "#3E2723",
              },
              "& .MuiInputLabel-root": {
                color: theme === "dark" ? "#bbbbbb" : "#5A4A42",
                fontFamily: "serif",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme === "dark" ? "#444444" : "#5A4A42",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!username || !password}
            sx={{
              mt: 2,
              borderRadius: "10px",
              bgcolor:
                username && password
                  ? theme === "dark"
                    ? "#FF8A00"
                    : "#FFB74D"
                  : "#D5B4B4",
              color: "#ffffff",
              ":hover": {
                bgcolor:
                  username && password
                    ? theme === "dark"
                      ? "#FF5E00"
                      : "#FF8A00"
                    : "#D5B4B4",
              },
              fontFamily: "serif",
            }}
          >
            Login
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, color: "#5A4A42" }}>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" color="inherit">
            Sign up
          </Link>
        </Typography>

        <Button
          variant="text"
          sx={{ mt: 2, color: theme === "dark" ? "#bbbbbb" : "#5A4A42" }}
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
