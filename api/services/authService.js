import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Cookie configuration object for better reusability and consistency
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 3600000, // 1 hour
  path: "/", // Explicitly set cookie path
  domain: process.env.COOKIE_DOMAIN || undefined, // Allow for different domains in different environments
};

class AuthService {
  async login(email, password) {
    try {
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, message: "Invalid password" };
      }

      const token = this.generateToken(user.id);
      return {
        success: true,
        message: "Login successful",
        user,
        token,
        cookieConfig: COOKIE_CONFIG,
      };
    } catch (error) {
      // console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login",
        error: error.message,
      };
    }
  }

  generateToken(userId) {
    return jwt.sign(
      {
        id: userId,
        timestamp: Date.now(), // Add timestamp for additional security
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256", // Explicitly specify the algorithm
      }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return error;
    }
  }
}

export default new AuthService();
