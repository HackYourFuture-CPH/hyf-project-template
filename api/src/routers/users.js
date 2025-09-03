import express from "express";
import bcrypt from "bcryptjs";
import knex from "../db.mjs";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import {
  profileUpdateSchema,
  passwordChangeSchema,
} from "../validation/schemas.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await knex("users")
      .select(
        "id",
        "first_name",
        "last_name",
        "email",
        "username",
        "mobile",
        "profile_image",
        "role",
        "is_active",
        "email_verified_at",
        "last_login_at",
        "created_at",
        "updated_at"
      )
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({
        error: "Profile not found",
        message:
          "We couldn't find your profile information. Please try logging in again.",
      });
    }

    res.json({
      message: "Profile retrieved successfully",
      data: {
        ...user,
        full_name: `${user.first_name} ${user.last_name}`,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      error: "Profile retrieval failed",
      message:
        "We encountered an error while loading your profile. Please try again later.",
    });
  }
});

// Update user profile
router.put(
  "/profile",
  validateRequest(profileUpdateSchema),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { first_name, last_name, mobile, profile_image } =
        req.validatedData;

      // Check if mobile is already taken by another user
      const existingMobile = await knex("users")
        .where({ mobile })
        .whereNot({ id: userId })
        .first();

      if (existingMobile) {
        return res.status(400).json({
          error: "Profile update failed",
          message: "This mobile number is already registered by another user.",
          details: [
            {
              field: "mobile",
              message: "Mobile number is already in use by another account.",
            },
          ],
        });
      }

      const updateData = {
        first_name,
        last_name,
        mobile,
        updated_at: new Date(),
      };

      // Add profile_image if provided
      if (profile_image) {
        updateData.profile_image = profile_image;
      }

      const [updatedUser] = await knex("users")
        .where({ id: userId })
        .update(updateData)
        .returning([
          "id",
          "first_name",
          "last_name",
          "email",
          "username",
          "mobile",
          "profile_image",
          "role",
          "updated_at",
        ]);

      res.json({
        message: `Great! Your profile has been updated successfully, ${first_name}.`,
        data: {
          ...updatedUser,
          full_name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        error: "Profile update failed",
        message:
          "We encountered an error while updating your profile. Please try again later.",
      });
    }
  }
);

// Change password
router.put(
  "/change-password",
  validateRequest(passwordChangeSchema),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { current_password, new_password, new_password_confirmation } =
        req.validatedData;

      // Get current user
      const user = await knex("users").where({ id: userId }).first();

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        current_password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          error: "Password change failed",
          message: "Your current password is incorrect. Please try again.",
          details: [
            {
              field: "current_password",
              message: "The current password you entered is incorrect.",
            },
          ],
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

      // Update password
      await knex("users").where({ id: userId }).update({
        password: hashedNewPassword,
        updated_at: new Date(),
      });

      res.json({
        message:
          "Perfect! Your password has been changed successfully. Please use your new password for future logins.",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        error: "Password change failed",
        message:
          "We encountered an error while changing your password. Please try again later.",
      });
    }
  }
);

// Admin only: Get all users (requires admin role)
router.get("/", requireRole(["admin"]), async (req, res) => {
  try {
    const users = await knex("users")
      .select(
        "id",
        "first_name",
        "last_name",
        "email",
        "username",
        "mobile",
        "role",
        "is_active",
        "created_at",
        "last_login_at"
      )
      .orderBy("created_at", "desc");

    res.json({
      message: "Users list retrieved successfully",
      data: users.map((user) => ({
        ...user,
        full_name: `${user.first_name} ${user.last_name}`,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Users retrieval failed",
      message:
        "We encountered an error while loading the users list. Please try again later.",
    });
  }
});

// Admin only: Update user status (activate/deactivate)
router.put("/:id/status", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        error: "Status update failed",
        message: "Please provide a valid status value (true or false).",
        details: [
          {
            field: "is_active",
            message: "Status must be either true or false.",
          },
        ],
      });
    }

    const [updatedUser] = await knex("users")
      .where({ id })
      .update({
        is_active,
        updated_at: new Date(),
      })
      .returning([
        "id",
        "first_name",
        "last_name",
        "email",
        "username",
        "is_active",
      ]);

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
        message: "We couldn't find the user you're trying to update.",
      });
    }

    const statusMessage = is_active ? "activated" : "deactivated";
    res.json({
      message: `User ${updatedUser.first_name} ${updatedUser.last_name} has been ${statusMessage} successfully.`,
      data: {
        ...updatedUser,
        full_name: `${updatedUser.first_name} ${updatedUser.last_name}`,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      error: "Status update failed",
      message:
        "We encountered an error while updating the user status. Please try again later.",
    });
  }
});

export default router;
