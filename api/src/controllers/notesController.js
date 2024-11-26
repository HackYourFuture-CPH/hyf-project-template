import knex from "../database_client.js";
export const getNotes = async (req, res) => {
  const { book_id, user_id } = req.query;
  if (!book_id || !user_id) {
    return res.status(400).json({ error: "book_id and user_id are required" });
  }

  try {
    const notes = await knex("Notes").where({ book_id, user_id });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNotes = async (req, res) => {
  const { book_id, user_id, content } = req.body;
  try {
    const [newNote] = await knex("Notes")
      .insert({ book_id, user_id, content })
      .returning("*");
    res.json(newNote);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateNotes = async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;
  try {
    const [updatedNote] = await knex("Notes")
      .where({ id, user_id })
      .update({ content, updated_at: knex.fn.now() })
      .returning("*");
    if (!updatedNote) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this note" });
    }
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotes = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const deletedCount = await knex("Notes").where({ id, user_id }).del();
    if (deletedCount) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ error: "Entry not found" });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
