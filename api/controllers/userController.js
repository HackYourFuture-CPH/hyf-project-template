// controllers/userController.js
import userService from "../services/userService.js";

const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

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
    const users = await userService.getAllUsers(); // Call a service to fetch users from DB
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

// Export createUser as a default export
export { createUser, getUsers };
