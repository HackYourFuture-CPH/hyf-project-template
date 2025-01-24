"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
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
import EditCourseForm from "@/app/_components/instructor-dashboard-components/EditCourseForm";
const EditPage = ({ params }) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchCourse = async () => {
    if (!id) {
      setError("Invalid Course ID");
      setLoading(false);
      return;
    }

    try {
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
        {
          method: "GET",
          credentials: "include", // This ensures cookies are sent with the request
        }
      );
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        setCourse(result);
        setFormData({
          title: result.title || "",
          description: result.description || "",
        });
      } else {
        const error = await apiResponse.json();
        console.error("Error fetching the course", error);
      }
    } catch (error) {
      console.error("error while submitting data", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send course details to the backend
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        toast.success("Successfully edited the course");
        router.push("/instructor-dashboard");
      } else {
        const error = await apiResponse.json();
        console.error("Error modifying the course", error);
      }
    } catch (error) {
      console.error("error while submitting data", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <>
      <EditCourseForm
        formData={formData}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default EditPage;
