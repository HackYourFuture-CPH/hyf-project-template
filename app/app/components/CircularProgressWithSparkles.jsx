"use client";
import { useEffect, useState, useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { keyframes } from "@mui/system";

const sparklesAnimation = keyframes`
    0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
  }
  20% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  }
  40% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
  }
`;

const glowAnimation = keyframes`
   0% {
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 1));
  }
  100% {
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.3));
  }
`;

const CircularProgressWithSparkles = ({ progress }) => {
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
    <Box sx={{ position: "relative", mb: 2, display: "inline-block" }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={100}
        thickness={5}
        sx={{
          color: color,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {progress === 100 ? (
            <span
              role="img"
              aria-label="sparkles"
              style={{
                fontSize: "30px",
                animation: `${glowAnimation} 1s ease-in-out infinite`,
                display: "inline-block",
              }}
            >
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
  const [showSparkles, setShowSparkles] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSparkles(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSparkles) {
    return null;
  }

  const numSparkles = 8;
  const maxRadius = 60;

  const sparkles = useMemo(() => {
    return Array.from({ length: numSparkles }, (_, index) => {
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomRadius = Math.random() * maxRadius;
      const x = randomRadius * Math.cos(randomAngle);
      const y = randomRadius * Math.sin(randomAngle);

      const randomDelay = Math.random() * 0.5;
      const randomDuration = 0.8 + Math.random() * 0.4;

      return (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: `calc(50% + ${y}px)`,
            left: `calc(50% + ${x}px)`,
            width: "20px",
            height: "20px",
            animation: `${sparklesAnimation} ${randomDuration}s ease-in-out infinite`,
            animationDelay: `${randomDelay}s`,
            pointerEvents: "none",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(45deg, #FFD700, #FFA500)",
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            },
            willChange: "transform, opacity",
          }}
        />
      );
    });
  }, [numSparkles, maxRadius]);

  return <Box sx={{ position: "absolute", inset: 0 }}>{sparkles}</Box>;
};

export default CircularProgressWithSparkles;
