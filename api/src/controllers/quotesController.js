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
