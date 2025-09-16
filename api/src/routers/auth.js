// auth.js
import express from "express";
import bcrypt from "bcryptjs";
import knex from "../db.mjs";
import { validateRequest } from "../middleware/validation.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(
    { sub: user.id, role: user.role ?? "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

const router = express.Router();

// Register a new user
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      // password_confirmation, // not used here because validation already ensures match
      mobile,
    } = req.validatedData;

    // Check for duplicates (email, username, mobile)
    const existingUser = await knex("users")
      .where({ email })
      .orWhere({ username })
      .orWhere({ mobile })
      .first();

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          error: "Registration failed",
          details: [
            {
              field: "email",
              message:
                "This email address is already registered. Please use a different email or try logging in.",
            },
          ],
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          error: "Registration failed",
          details: [
            {
              field: "username",
              message:
                "This username is already taken. Please choose a different username.",
            },
          ],
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          error: "Registration failed",
          details: [
            {
              field: "mobile",
              message:
                "This mobile number is already registered. Please use a different number or try logging in.",
            },
          ],
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [newUser] = await knex("users")
      .insert({
        first_name,
        last_name,
        email,
        username,
        password: hashedPassword,
        mobile,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning([
        "id",
        "first_name",
        "last_name",
        "email",
        "username",
        "mobile",
        "created_at",
      ]);

    // Generate JWT token in a safe block; do not break the success response if it fails
    let token = null;
    try {
      token = generateToken(newUser);
    } catch (e) {
      console.error("JWT generation failed (register):", e);
      // Optionally notify monitoring here; we still return 201 to avoid confusing the user
    }

    return res.status(201).json({
      message: `Welcome ${first_name}! Your account has been created successfully.`,
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        username: newUser.username,
        mobile: newUser.mobile,
        full_name: `${newUser.first_name} ${newUser.last_name}`,
      },
      token, // may be null if JWT generation failed
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: "Registration failed",
      message:
        "We encountered an error while creating your account. Please try again later.",
    });
  }
});

// Login user
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { login_identifier, password } = req.validatedData;

    // Find user by email, username, or mobile
    const user = await knex("users")
      .where({ email: login_identifier })
      .orWhere({ username: login_identifier })
      .orWhere({ mobile: login_identifier })
      .first();

    if (!user) {
      return res.status(401).json({
        error: "Login failed",
        message:
          "We couldn't find an account with those credentials. Please check your email/username/mobile and try again.",
        details: [
          {
            field: "login_identifier",
            message:
              "No account found with this email, username, or mobile number.",
          },
        ],
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: "Account deactivated",
        message:
          "Your account has been deactivated. Please contact support to reactivate your account.",
        details: [
          { field: "account", message: "Account is currently inactive." },
        ],
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Login failed",
        message: "The password you entered is incorrect. Please try again.",
        details: [
          {
            field: "password",
            message:
              "Incorrect password. Please check your password and try again.",
          },
        ],
      });
    }

    // Update last login (best-effort; do not block success if it fails)
    try {
      await knex("users")
        .where({ id: user.id })
        .update({ last_login_at: new Date() });
    } catch (e) {
      console.error("Failed to update last_login_at:", e);
    }

    // Generate JWT token in a safe block
    let token = null;
    try {
      token = generateToken(user);
    } catch (e) {
      console.error("JWT generation failed (login):", e);
      // Optionally continue without token or handle differently
    }

    // Determine login method for friendly message
    let loginMethod = "account";
    if (login_identifier === user.email) loginMethod = "email";
    else if (login_identifier === user.username) loginMethod = "username";
    else if (login_identifier === user.mobile) loginMethod = "mobile number";

    return res.json({
      message: `Welcome back, ${user.first_name}! You have successfully logged in with your ${loginMethod}.`,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        mobile: user.mobile,
        profile_image: user.profile_image,
        full_name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        is_active: user.is_active,
      },
      token, // may be null if JWT generation failed
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Login failed",
      message:
        "We encountered an error while processing your login. Please try again later.",
    });
  }
});

// Get user profile (requires authentication)
router.get("/profile", async (req, res) => {
  try {
    // This route would require authentication middleware
    return res.json({
      message: "Profile endpoint - requires authentication middleware",
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
