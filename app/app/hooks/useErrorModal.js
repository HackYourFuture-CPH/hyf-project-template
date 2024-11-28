"use state";
import { useState } from "react";

export const useErrorModal = () => {
  const [error, setError] = useState({
    isOpen: false,
    message: "",
    title: "Error",
    severity: "error",
  });

  const showError = (message, title = "Error", severity = "error") => {
    setError({
      isOpen: true,
      message,
      title,
      severity,
    });
  };

  const hideError = () => {
    setError((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return { error, showError, hideError };
};
