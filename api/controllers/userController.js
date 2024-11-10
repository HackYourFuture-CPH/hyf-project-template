import userService from "../services/userService.js";

const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await userService.createUserService(
      name,
      email,
      password,
      phone
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
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  try {
    const userData = await userService.loginAuth(email, password);
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Export createUser as a default export
export { createUser, getUsers, login };
