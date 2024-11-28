import knex from "../database_client.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await knex("Users")
      .select("user_id", "username", "email", "created_at")
      .orderBy("created_at", "desc");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
