"use state";
import { useState } from "react";

export const useErrorModal = () => {
  const [error, setError] = useState({
    isOpen: false,
    message: "",
    title: "Error",
  });

  const showError = (message, title = "Error") => {
    setError({
      isOpen: true,
      message,
      title,
    });
  };

  const hideError = () => {
    setError({
      isOpen: false,
      message: "",
      title: "Error",
    });
  };

  return { error, showError, hideError };
};
