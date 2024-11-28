import { Modal, Box, Button, Typography } from "@mui/material";

const ErrorModal = ({
  isOpen,
  onClose,
  message,
  title = "Error",
  buttonText = "OK",
  severity = "error",
}) => {
  const getColor = () => {
    switch (severity) {
      case "error":
        return "error.main";
      case "warning":
        return "warning.main";
      case "info":
        return "info.main";
      case "success":
        return "success.main";
      default:
        return "error.main";
    }
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: "90vw",
          width: 400,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, color: getColor() }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={onClose} color="primary">
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
