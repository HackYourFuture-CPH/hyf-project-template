"use client";
import Button from "@mui/material/Button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

const CreateLecture = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    if (selectedVideo && selectedVideo.size / (1024 * 1024) > 200) {
      setErrors((prevState) => ({
        ...prevState,
        video: "File size exceeds 200MB limit",
      }));
      setVideoPreview(null);
      event.target.value = "";
    } else {
      setVideo(selectedVideo);
      setVideoPreview(URL.createObjectURL(selectedVideo));
      setErrors((prevState) => ({ ...prevState, video: null }));
    }
  };
  const checkForErrors = () => {
    const errors = {};
    if (!title || title.trim() === "") {
      errors.title = "Please provide valid title";
    } else if (!/^[a-zA-Z\s]+$/.test(title.trim())) {
      errors.title = "Title should contain only letters and spaces";
    }
    if (!description || description.trim() === "") {
      errors.description = "Please provide valid description";
    }
    if (!video || video.size === 0) {
      errors.video = "Please upload a video";
    }
    return errors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errorFields = checkForErrors();
    console.log("error fields", errorFields);
    if (Object.keys(errorFields).length > 0) {
      setErrors(errorFields);
      setIsLoading(false);
      return;
    }
    try {
      console.log("submitting data...");
    } catch (error) {
      console.error("error while submitting data", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 14, mb: 4 }}>
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ color: "black" }}
          >
            Create a new lecture
          </Typography>
          <Typography variant="body1" align="center">
            Add title ,description , video to add a new lecture to the course
          </Typography>
        </Box>
        <Container maxWidth="sm">
          <Paper elevation={4} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="text"
                label="Course Title"
                name="title"
                value={title}
                margin="normal"
                size="small"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && (
                <span style={{ color: "red" }}>{errors.title}</span>
              )}
              <TextField
                fullWidth
                label="Description"
                name="description"
                type="text"
                value={description}
                margin="normal"
                size="small"
                multiline
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              {errors.description && <span>{errors.description}</span>}

              {videoPreview && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <video
                    src={videoPreview}
                    alt="Uploaded Preview"
                    controls
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              {/* VideoPicker */}
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-black rounded-md cursor-pointer hover:bg-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                Upload a video
              </label>
              <input
                type="file"
                id="video-upload"
                name="video"
                accept="video/*"
                hidden
                onChange={handleVideoChange}
              />

              {errors.video && <span>{errors.video}</span>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  mt: 2,
                  backgroundColor: "black",
                  color: "#fff", // Text color
                  "&:hover": {
                    backgroundColor: "#374151",
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Add your lecture"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Container>
    </>
  );
};

export default CreateLecture;