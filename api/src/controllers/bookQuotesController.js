import knex from "../database_client.js";
export const getQuotes = async (req, res) => {
  const { book_id, user_id } = req.query;
  console.log("book_id:", book_id, "user_id:", user_id);
  if (!book_id || !user_id) {
    return res.status(400).json({ error: "book_id and user_id are required" });
  }

  try {
    const quotes = await knex("Quotes").where({ book_id, user_id });
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addQuote = async (req, res) => {
  const { book_id, user_id, content } = req.body;
  try {
    const [newQuote] = await knex("Quotes")
      .insert({ book_id, user_id, content })
      .returning("*");
    res.json(newQuote);
  } catch (error) {
    console.error("Error adding quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateQuote = async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;

  try {
    const result = await knex("Quotes")
      .where({ id, user_id })
      .update({ content });

    if (result === 0) {
      return res.status(403).json({
        error: "Not authorized to update this quote or quote not found",
      });
    }

    const updatedQuote = await knex("Quotes").where({ id }).first();

    res.json(updatedQuote);
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteQuote = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "Missing user_id in query parameters" });
  }

  try {
    const result = await knex("Quotes").where({ id, user_id }).del();

    if (result === 0) {
      return res.status(403).json({
        error: "Not authorized to delete this quote or quote not found",
      });
    }

    res.json({ success: true, message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
