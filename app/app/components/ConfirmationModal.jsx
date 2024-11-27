import { Modal, Box, Button, Typography } from "@mui/material";

const ConformationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Yes",
  cancelText = "No",
}) => {
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
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ marginLeft: 2 }}
          >
            {cancelText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConformationModal;
