import User from "../models/user-model.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

const createNewUser = async (req, res) => {
  const { name, email, password, role } = req.value.body;
  const createdAt = new Date();

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt,
      role,
    });
    res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Route handler for fetching user details
const findUserDetails = async (req, res) => {
  try {
    // `req.user` comes from the middleware
    const user = await User.findOne({ where: { id: req.user.sub } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

export { createNewUser, findUserDetails };
