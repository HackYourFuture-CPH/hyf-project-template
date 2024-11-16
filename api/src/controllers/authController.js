import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import knex from "../database_client.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    profile_image_url = null,
    about = null,
  } = req.body;

  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await knex("Users")
      .where({ username })
      .orWhere({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const [userId] = await knex("Users").insert({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
      profile_image_url,
      about,
    });

    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const user = await knex("Users")
      .where({ user_id: userId })
      .select(
        "user_id",
        "username",
        "email",
        "first_name",
        "last_name",
        "profile_image_url",
        "about"
      );
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await knex("Users").where({ username }).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        about: user.about,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully", user: null });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
