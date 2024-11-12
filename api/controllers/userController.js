import userService from "../services/userService.js";

const createUser = async (req, res) => {
  const { name, email, password, phone, role_name } = req.body;
  if (!name || !email || !password || !phone || !role_name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await userService.createUserService(
      name,
      email,
      password,
      phone,
      role_name
    );
    res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    console.log("Cookies: ", req.cookies);
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};
const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Id not received" });
  }
  try {
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};
export { createUser, getUsers, getUserById };
