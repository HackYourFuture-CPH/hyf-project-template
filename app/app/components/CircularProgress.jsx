import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { keyframes } from "@mui/system";

const sparklesAnimation = keyframes`
  0%,100% {
  transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
  transform: scale(1.5) rotate(45deg);
    opacity: 0.5;
  }
  
`;

const CircularProgress = ({ progress, booksCount, goalCount }) => {
  const color =
    progress === 100
      ? "#4CAF50"
      : progress > 75
      ? "#FF9800"
      : progress > 50
      ? "#FFC107"
      : progress > 25
      ? "#03A9F4"
      : "#D5B4B4";

  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={80}
        thickness={4}
        sx={{
          color: color,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div">
          {progress === 100 ? (
            <span role="img" aria-label="sparkles">
              ✨
            </span>
          ) : (
            `${Math.round(progress)}%`
          )}
        </Typography>
      </Box>
      {progress === 100 && <SparkleEffect />}
    </Box>
  );
};

const SparkleEffect = () => {
  const numSparkles = 10;
  const sparkles = Array.from({ length: numSparkles }, (_, index) => (
    <Box
      key={index}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: `${sparklesAnimation} 1.5s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
        opacity: 0,
      }}
    >
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#FFD700",
        }}
      />
    </Box>
  ));

  return <>{sparkles}</>;
};

export default CircularProgress;
