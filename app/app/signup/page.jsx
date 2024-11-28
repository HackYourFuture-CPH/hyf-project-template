"use client";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid2,
  Box,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { useState } from "react";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const isValidate = () => {
    let isValid = true;
    let tempErrors = {};
    if (!data.firstName) {
      tempErrors.firstName = "Firstname is required";
      isValid = false;
    }
    if (!data.lastName) {
      tempErrors.lastName = "Lastname is required";
      isValid = false;
    }
    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }
    if (!data.password) {
      tempErrors.password = "Password";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidate()) {
      setData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      alert("Welcome to LeafNotes");
      router.push("/profile");
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        background: "#F0D2D6",
        borderRadius: "10px",
        top: "50%",
        position: "absolute",
        transform: "translate(0,-50%)",
        right: "5%",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "jacques Francois",
            marginBottom: 2,
            color: "#3C3C3C",
            fontWeight: "500",
            whiteSpace: "pre-line",
            letterSpacing: "0.5px",
            lineHeight: 1.5,
            padding: "10px 20px",
            backgroundColor: "#F5ECE8",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ fontWeight: "bold", fontStyle: "italic" }}>
            Welcome to LeafNotes {"\n"}
          </Box>
          Track what you've read and {"\n"}what's next.
        </Typography>

        <Box sx={{ width: "500px", height: "auto" }}>
          <img src="./books.jpg" style={{ width: "100%", height: "auto" }} />
        </Box>
      </Container>
      <Container
        maxWidth="md"
        sx={{
          padding: 3,
          background: "#EAD3C4",
          borderRadius: "10px",
          marginRight: "-25px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            margin: "15px",
            fontFamily: "jacques Francois",
          }}
        >
          Create Account{" "}
        </Typography>{" "}
        <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
          {" "}
          <Grid2 container spacing={2} sx={{ width: "100%" }}>
            {" "}
            <Grid2 xs={6} sx={{ flexGrow: 1, maxWidth: "50%" }}>
              {" "}
              <TextField
                variant="outlined"
                required
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="fname"
                fullWidth
                value={data.firstName}
                onChange={handleChange}
                error={errors.firstName}
                helperText={errors.firstName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />{" "}
            </Grid2>{" "}
            <Grid2 xs={6} sx={{ flexGrow: 1, maxWidth: "50%" }}>
              {" "}
              <TextField
                variant="outlined"
                required
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                fullWidth
                value={data.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />{" "}
            </Grid2>{" "}
          </Grid2>{" "}
        </Box>{" "}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={data.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />{" "}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={data.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />{" "}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            background: "grey",
            borderRadius: 2,
            mt: 3,
            mb: 2,
            fontFamily: "jacques Francois",
            textTransform: "none",
            fontSize: "20px",
          }}
          onClick={handleSubmit}
        >
          Submit{" "}
        </Button>{" "}
        <Typography variant="h8">
          Already have an account?{" "}
          <a href="/login" target="_blank" style={{ color: "blueviolet" }}>
            Login{" "}
          </a>{" "}
        </Typography>{" "}
        <Box display="flex" alignItems="center" my={3}>
          <Divider sx={{ flex: 1 }} /> {" "}
          <Typography
            variant="body1"
            sx={{ mx: 2, color: "gray", fontFamily: "Barriecito" }}
          >
            OR{" "}
          </Typography>
          <Divider sx={{ flex: 1 }} /> {" "}
        </Box>{" "}
        <Box sx={{ width: "100%", marginBottom: "25px" }}>
          {" "}
          <Grid2 container spacing={2} sx={{ width: "100%" }}>
            {" "}
            <Grid2 sx={{ flexGrow: "1", maxWidth: "50%" }}>
              {" "}
              <a href="https://www.facebook.com/login.php/" target="_blank">
                {" "}
                <Button
                  variant="outlined"
                  fullWidth
                  color="grey"
                  sx={{
                    textTransform: "none",
                    gap: 2,
                    color: "grey",
                    "&:hover": { borderColor: "black" },
                  }}
                >
                  {" "}
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/fluency/48/facebook-new.png"
                    alt="facebook-new"
                  />
                  Signup with Facebook{" "}
                </Button>{" "}
              </a>{" "}
            </Grid2>{" "}
            <Grid2 sx={{ flexGrow: "1", maxWidth: "50%" }}>
              {" "}
              <a
                href="https://www.instagram.com/accounts/login/?hl=en"
                target="_blank"
              >
                {" "}
                <Button
                  variant="outlined"
                  fullWidth
                  color="grey"
                  sx={{
                    color: "grey",
                    "&:hover": { borderColor: "black" },
                    textTransform: "none",
                    gap: 2,
                  }}
                >
                  {" "}
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/3d-fluency/94/instagram-logo.png"
                    alt="instagram-logo"
                  />
                  Signup with Instagram{" "}
                </Button>{" "}
              </a>{" "}
            </Grid2>{" "}
          </Grid2>{" "}
        </Box>{" "}
      </Container>{" "}
    </Container>
  );
};

export default SignUp;
