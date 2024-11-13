import knex from "../database_client.js";

export const getUserProfile = async (req, res) => {
  const { user_id } = req.params;

  if (parseInt(req.user.userId) !== parseInt(user_id))
    return res.status(403).json({ error: "Forbidden" });

  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(user_id) })
      .first();

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
export const updateUserDetails = async (req, res) => {
  const { user_id } = req.params;

  const { first_name, last_name, email, username, about } = req.body;
  if (parseInt(req.user.userId) !== parseInt(user_id))
    return res.status(403).json({ error: "Forbidden" });
  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(user_id) })
      .first();
    if (!user) return res.status(404).json({ error: "User not found" });
    if (username && user.username !== username) {
      const existingUser = await knex("Users").where({ username }).first();
      if (existingUser)
        return res.status(400).json({ error: "Username already exists" });
    }
    if (email && user.email !== email) {
      const existingUser = await knex("Users").where({ email }).first();
      if (existingUser)
        return res.status(400).json({ error: "Email already exists" });
    }
    await knex("Users")
      .where({ user_id: parseInt(user_id) })
      .update({
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
        email: email ?? user.email,
        username: username ?? user.username,
        about: about ?? user.about,
      });

    const updatedUser = await knex("Users")
      .where({ user_id: parseInt(user_id) })
      .first();
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
