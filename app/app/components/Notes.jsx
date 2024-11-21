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

const Notes = ({ open, handleClose, bookId }) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    if (bookId && currentUser && currentUser.user) {
      const fetchNotes = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/notes/notes?book_id=${bookId}&user_id=${currentUser.user.id}`
          );
          const data = await response.json();
          setNotes(data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };
      fetchNotes();
    }
  }, [bookId, currentUser]);

  const handleAddOrEditNote = async () => {
    if (!currentUser || !currentUser.user) {
      console.error("User not authenticated");
      return;
    }

    const userId = currentUser.user.id;
    const noteData = {
      book_id: bookId,
      content: noteContent,
      user_id: userId,
    };

    try {
      if (editingNoteId) {
        await fetch(`http://localhost:3001/api/notes/notes/${editingNoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, content: noteContent }),
        });
      } else {
        await fetch("http://localhost:3001/api/notes/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }

      setNoteContent("");
      setEditingNoteId(null);
      setShowAddNote(false);

      const response = await fetch(
        `http://localhost:3001/api/notes/notes?book_id=${bookId}&user_id=${userId}`
      );
      const updatedNotes = await response.json();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error adding or editing note:", error);
    }
  };

  const handleEditNote = (note) => {
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    setShowAddNote(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`http://localhost:3001/api/notes/notes/${noteId}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: "center",
          fontFamily: "font-family: var(--font-playfair), serif",

          fontSize: "1.8rem",
          color: "green",
        }}
      >
        Manage Notes
      </DialogTitle>
      <DialogContent>
        {!showAddNote ? (
          <Box>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Box
                  key={note.id}
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
                  <Typography>{note.content}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEditNote(note)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteNote(note.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No notes found. Add one!</Typography>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {editingNoteId ? "Edit Note" : "Add a New Note"}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {!showAddNote ? (
          <>
            <Button
              onClick={() => setShowAddNote(true)}
              variant="contained"
              sx={{ backgroundColor: "green" }}
            >
              Add Note
            </Button>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Close
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleAddOrEditNote}
              variant="contained"
              color="primary"
            >
              Save Note
            </Button>
            <Button
              onClick={() => {
                setShowAddNote(false);
                setEditingNoteId(null);
                setNoteContent("");
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
  );
};

export default Notes;
