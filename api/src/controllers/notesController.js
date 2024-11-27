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
    const result = await knex("Notes")
      .where({ id, user_id })
      .update({ content });

    if (result === 0) {
      return res.status(403).json({
        error: "Not authorized to update this note or note not found",
      });
    }

    const updatedNote = await knex("Notes").where({ id }).first();

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating Note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotes = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "Missing user_id in query parameters" });
  }

  try {
    const result = await knex("Notes").where({ id, user_id }).del();

    if (result === 0) {
      return res.status(403).json({
        error: "Not authorized to delete this note or note not found",
      });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting Note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
