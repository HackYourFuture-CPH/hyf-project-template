"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../contexts/AuthContext.jsx";
import { makeRequest } from "../utils/makeRequest.js";

const Notes = ({ open, handleClose, bookId, type }) => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entryContent, setEntryContent] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const openConfirmDialog = (entryId) => {
    setEntryToDelete(entryId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    handleDeleteEntry(entryToDelete);
    setIsConfirmOpen(false);
    setEntryToDelete(null);
  };

  useEffect(() => {
    if (bookId && currentUser && currentUser.user) {
      const fetchEntries = async () => {
        try {
          const data = await makeRequest(
            `/api/book-${type}/?book_id=${bookId}&user_id=${currentUser.user.id}`,
            {},
            "GET"
          );
          setEntries(data);
        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
        }
      };
      fetchEntries();
    }
  }, [bookId, currentUser, type]);

  const handleAddOrEditEntry = async () => {
    if (!currentUser || !currentUser.user) {
      console.error("User not authenticated");
      return;
    }

    const userId = currentUser.user.id;
    const entryData = {
      book_id: bookId,
      content: entryContent,
      user_id: userId,
    };
    console.log({ editingEntryId, userId, entryContent });

    try {
      if (editingEntryId) {
        await makeRequest(
          `/api/book-${type}/${editingEntryId}`,
          { user_id: userId, content: entryContent },
          "PUT"
        );
      } else {
        await makeRequest(`/api/book-${type}/add-${type}`, entryData, "POST");
      }

      setEntryContent("");
      setEditingEntryId(null);
      setShowAddEntry(false);

      // Fetch updated entries after adding/editing
      const updatedEntries = await makeRequest(
        `/api/book-${type}?book_id=${bookId}&user_id=${userId}`,
        {},
        "GET"
      );
      setEntries(updatedEntries);
    } catch (error) {
      console.error(`Error adding or editing ${type}:`, error);
    }
  };

  const handleEditEntry = (entry) => {
    setEntryContent(entry.content);
    setEditingEntryId(entry.id);
    setShowAddEntry(true);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await makeRequest(
        `/api/book-${type}/${entryId}`,
        { user_id: currentUser.user.id },
        "DELETE"
      );

      if (response === null) {
        setEntries(entries.filter((entry) => entry.id !== entryId));
      } else {
        console.error(`Failed to delete book-${type}:`, response);
      }
    } catch (error) {
      console.error(`Error deleting book-${type}:`, error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "font-family: var(--font-playfair), serif",
            fontSize: "1.8rem",
            color: type === "notes" ? "green" : "blue",
          }}
        >
          Manage {type === "notes" ? "Notes" : "Quotes"}
        </DialogTitle>
        <DialogContent>
          {!showAddEntry ? (
            <Box>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography>{entry.content}</Typography>
                    <Box>
                      <IconButton
                        onClick={() => handleEditEntry(entry)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openConfirmDialog(entry.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No {type} found. Add one!</Typography>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                {editingEntryId
                  ? `Edit ${type === "notes" ? "Note" : "Quote"}`
                  : `Add a New ${type === "notes" ? "Note" : "Quote"}`}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder={`Write your ${
                  type === "notes" ? "note" : "quote"
                } here...`}
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!showAddEntry ? (
            <>
              <Button
                onClick={() => setShowAddEntry(true)}
                variant="contained"
                sx={{ backgroundColor: type === "notes" ? "green" : "blue" }}
              >
                Add {type === "notes" ? "Note" : "Quote"}
              </Button>
              <Button onClick={handleClose} variant="outlined" color="primary">
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleAddOrEditEntry}
                variant="contained"
                color="primary"
              >
                Save {type === "notes" ? "Note" : "Quote"}
              </Button>
              <Button
                onClick={() => {
                  setShowAddEntry(false);
                  setEditingEntryId(null);
                  setEntryContent("");
                }}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this{" "}
            {type === "notes" ? "Note" : "Quote"}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsConfirmOpen(false)}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Notes;
