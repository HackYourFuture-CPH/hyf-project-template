import User from "../models/user.js";
import bcrypt from "bcrypt";
import Role from "../models/role.js";

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

export default { createUserService, getAllUsers };
