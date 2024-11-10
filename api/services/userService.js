import User from "../models/user.js";
import bcrypt from "bcrypt";

const createUserService = async (name, email, password, phone) => {
  const createdAt = new Date();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      createdAt,
    });
    return user;
  } catch (err) {
    throw new Error("Error creating user: " + err.message);
  }
};
const getAllUsers = async () => {
  return await User.findAll();
};

const loginAuth = async (email, password) => {
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
export default { createUserService, getAllUsers, loginAuth };
