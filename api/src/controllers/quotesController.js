import knex from "../database_client.js";

export const getQuotes = async (req, res) => {
    try {
        const response = await knex("Quotes").select("*");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error on fetching", error);
        res.status(500).json({ message: "Failed to fetch quotes" });
    }
};

export const addQuote = async (req, res) => {
    const { bookId, userId, quoteText, author } = req.body;

    if (!bookId || !userId || !quoteText) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newQuote = await knex("Quotes").insert({
            book_id: bookId,
            user_id: userId,
            quote_text: quoteText,
            author: author || null,
        });

        res.status(201).json({ message: "Quote added successfully", quoteId: newQuote[0] });
    } catch (error) {
        console.log("Error adding quote:", error);
        res.status(500).json({ message: "Failed to add quote" });
    }
};

export const getUserQuotes = async (req, res) => {
    const { userId } = req.params;

    try {
        const quotes = await knex("Quotes as q")
            .leftJoin("Books as b", "q.book_id", "b.book_id")
            .select(
                "q.quote_id",
                "q.quote_text",
                "b.title as book_title",
                "b.author as book_author"
            )
            .where("q.user_id", userId);

        if (!quotes || quotes.length === 0) {
            return res.status(200).json({ quotes: [] });
        }

        res.status(200).json({ quotes });
    } catch (error) {
        console.error("Error fetching user quotes:", error);
        res.status(500).json({ error: "Failed to fetch user quotes." });
    }
};

export const deleteQuote = async (req, res) => {
    const { quoteId } = req.params;

    if (!quoteId) {
        return res.status(400).json({ error: "Quote ID is required." });
    }

    try {
        const deletedRows = await knex("Quotes").where("quote_id", quoteId).del();

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Quote not found." });
        }

        res.status(200).json({ message: "Quote removed successfully." });
    } catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ error: "Failed to delete quote." });
    }
};
