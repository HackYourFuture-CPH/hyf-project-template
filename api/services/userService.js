import User from "../models/user.js";
import bcrypt from "bcrypt";
import Role from "../models/role.js";
import jwt from "jsonwebtoken";

const createUserService = async (name, email, password, phone, roleName) => {
  const createdAt = new Date();
  try {
    const role = await Role.findOne({ where: { role_name: roleName } });
    if (!role) throw new Error("Role not found");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      createdAt,
      role_id: role.id,
    });
    return user;
  } catch (err) {
    throw new Error("Error creating user: " + err.message);
  }
};
const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { sub: user_id } = decoded;
  console.log("decoded: " + JSON.stringify(decoded));

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(
      "user: " +
        {
          email: user.email,
          role: user.role_name,
        }
    );
    return {
      email: user.email,
      role: user.role_name,
    };
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};
export default {
  createUserService,
  getAllUsers,
  getUserById,
  getUserFromToken,
};
