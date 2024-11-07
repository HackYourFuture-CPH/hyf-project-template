import db from "../config/db.js";
import User from "../models/user.js";

const createUserService = async (name, email, password, phone) => {
  try {
    // Create a new user in the database
    const user = await db.User.create({
      name,
      email,
      password,
      phone,
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
