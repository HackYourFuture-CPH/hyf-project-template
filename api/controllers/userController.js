import User from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("received below info", req.body);
  const createdAt = new Date();
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields must be provided" });
  }
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt,
      role,
    });
    console.log("user created :", user);
    res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

//function to get user details from token
const findUserDetails = async (req, res) => {
  const token = req.cookies.token || req.body.token;
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "JWT must be provided" });
  }
  try {
    // const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("decoded data", decoded);
    // const userId = decoded.sub;
    // // Find the user based on the decoded token (usually using user ID)
    // const user = await User.findOne({ where: { id: userId } });
    // console.log("User from id :", user);
    // if (!user) {
    //   return res.status(404).json({ message: "user not found" });
    // }
    // return {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    // };
    // res.status(200).json(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.sub) {
      throw new Error("Invalid token format");
    }
    const userId = decoded.sub;
    //console.log("Decoded token: " + JSON.stringify(decoded));

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

export { createNewUser, findUserDetails };
