"use client";
import Button from "@mui/material/Button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
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

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    // Clean up any previously set preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (selectedImage && selectedImage.size / (1024 * 1024) > 5) {
      setErrors((prevState) => ({
        ...prevState,
        image: "File size exceeds 5MB limit",
      }));
      setImagePreview(null);
      event.target.value = "";
    } else {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage)); // Create new preview URL
      setErrors((prevState) => ({ ...prevState, image: null }));
    }
  };

  const checkForErrors = () => {
    const errors = {};
    if (!title || title.trim() === "") {
      errors.title = "Please provide valid title";
    }
    if (!description || description.trim() === "") {
      errors.description = "Please provide valid description";
    }
    if (isNaN(price) || price < 0) {
      errors.price = "Please provide valid price";
    }
    if (!image || image.size === 0) {
      errors.image = "Please upload an image";
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
      const imageKey = await handleFileUpload(image);

      // Send course details to the backend
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            imageKey,
            price,
          }),
        }
      );
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        toast.success("Created new course");
        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);
        setImagePreview(null);
        router.push("/instructor-dashboard");
      } else {
        const error = await apiResponse.json();
        console.error("Error creating the course", error);
      }
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
            Create a new course
          </Typography>
          <Typography variant="body1" align="center">
            Add title ,description to create a new course
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
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={price}
                margin="normal"
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">DKK</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                    },
                  },
                }}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              {errors.price && <span>{errors.price}</span>}

              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              {/* <ImagePicker */}
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white bg-black rounded-md cursor-pointer hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                Upload an image
              </label>
              <input
                type="file"
                id="image-upload"
                name="image"
                accept="image/png, image/jpeg"
                hidden
                onChange={handleImageChange}
              />

              {errors.image && <span>{errors.image}</span>}
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
                {isLoading ? "Submitting..." : "Add your course"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Container>
    </>
  );
};

export default CreateCourse;
