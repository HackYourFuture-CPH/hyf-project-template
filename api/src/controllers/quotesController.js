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
