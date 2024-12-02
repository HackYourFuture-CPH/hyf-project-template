import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const SuccessModal = ({ isOpen, message, onClose }) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Success</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default SuccessModal;
