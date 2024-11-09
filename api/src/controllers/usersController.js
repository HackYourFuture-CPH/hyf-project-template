import knex from "../database_client.js";
import bcrypt from "bcryptjs";

export const createUserProfile = async (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await knex("Users")
      .where({ username })
      .orWhere({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const result = await knex("Users").insert({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
    });

    const newUserId = result[0];
    const newUser = await knex("Users").where({ user_id: newUserId }).first();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
