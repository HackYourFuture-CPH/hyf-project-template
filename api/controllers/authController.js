import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET;

export const loginHandler = async (req, res) => {
  const { email, password } = req.value.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log("token =", token);
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JS from accessing cookie
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration (24 hours in milliseconds)
      path: "/", // Accessible on all paths
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "login error",
      error: error.message,
    });
  }
};

const generateToken = (user) => {
  try {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );
  } catch (error) {
    throw new Error("Error generating token", error.message);
  }
};
