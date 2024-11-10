// import db from "../config/db.js";
import User from "../models/user.js";

const createUserService = async (name, email, password, phone) => {
  const createdAt = new Date();
  try {
    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password,
      phone,
      createdAt,
    });
    return user;
  } catch (err) {
    throw new Error("Error creating user: " + err.message);
  }
};
const getAllUsers = async () => {
  return await User.findAll(); // Fetches all users from the User model (database)
};
export default { createUserService, getAllUsers };
