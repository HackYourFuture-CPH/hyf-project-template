"use client";
import Button from "@mui/material/Button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { handleFileUpload } from "@/utils/handleFileUpload";
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
import { useRouter } from "next/navigation";

const CreateLecture = ({ params }) => {
  const { id } = React.use(params);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoPreview, setVideoPreview] = useState(null);
  const router = useRouter();

  const MAX_FILE_SIZE_MB = 100; //maximum file size limit

  const handleVideoChange = (event) => {
    try {
      const selectedVideo = event.target.files[0];

      if (!selectedVideo) {
        setErrors((prevState) => ({
          ...prevState,
          video: "No file selected",
        }));
        return;
      }

      const fileSizeMB = selectedVideo.size / (1024 * 1024); // Converting file size to MB
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setErrors((prevState) => ({
          ...prevState,
          video: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
        }));
        setVideoPreview(null);
        setVideo(null);
        event.target.value = ""; // Clearing input value
        return;
      }

      // Revoke any existing video preview URL to avoid memory leaks
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      // Set the new video and preview URL
      setVideo(selectedVideo);
      setVideoPreview(URL.createObjectURL(selectedVideo));
      setErrors((prevState) => ({
        ...prevState,
        video: null,
      }));
    } catch (error) {
      console.error("Error handling video upload:", error);
      setErrors((prevState) => ({
        ...prevState,
        video: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  const checkForErrors = () => {
    const errors = {};
    if (!title || title.trim() === "") {
      errors.title = "Please provide valid title";
    }

    if (!video || video.size === 0) {
      errors.video = "Please upload a video";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errorFields = checkForErrors();
    if (Object.keys(errorFields).length > 0) {
      setErrors(errorFields);
      setIsLoading(false);
      return;
    }
    try {
      const videoKey = await handleFileUpload(video);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/lectures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, videoKey }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Created new lecture ! 🎉");
        setTitle("");
        setVideo(null);
        setVideoPreview(null);
        router.push("/instructor-dashboard");
      } else {
        const { message } = await response.json();
        console.error(`Error details: ${message}`);
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
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
            Add title , video to add a new lecture to the course
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
