import knex from "../database_client.js";

export const getUserProfile = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await knex("Users").where({ user_id }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
