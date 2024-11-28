// components/IconToggle.jsx
"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import { useTheme } from "../contexts/ThemeContext"; // Import the useTheme hook

const IconToggle = () => {
  const { theme, toggleTheme } = useTheme(); // Access the theme context

  return (
    <IconButton onClick={toggleTheme} sx={{ color: "#FFEB3B" }}>
      {theme === "dark" ? <ModeNightIcon /> : <WbSunnyIcon />}
    </IconButton>
  );
};

export default IconToggle;
