import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { success: false, message: "Invalid password" };
    }

    return { success: true, message: "Login successful", user };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export default { authService, generateToken };
