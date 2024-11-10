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

export default { createUserService, getAllUsers };
