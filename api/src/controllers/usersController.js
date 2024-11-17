import knex from "../database_client.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user_id: user.user_id,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
export const updateUserDetails = async (req, res) => {
  try {
    const user = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
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
      .where({ user_id: parseInt(req.user.userId) })
      .update({
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
        email: email ?? user.email,
        username: username ?? user.username,
        about: about ?? user.about,
      });

    const updatedUser = await knex("Users")
      .where({ user_id: parseInt(req.user.userId) })
      .first();
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await knex.transaction(async (trx) => {
      const user = await trx("Users")
        .where({ user_id: parseInt(req.user.userId) })
        .first();
      if (!user) return res.status(404).json({ error: "User not found" });
      await trx("Notes")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Quotes")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("ReadingGoals")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Reviews")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("UserBooks")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
      await trx("Users")
        .where({ user_id: parseInt(req.user.userId) })
        .del();
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
