import { z } from "zod";

// Registration schema with comprehensive validation
export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    last_name: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),

    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .refine(
        (username) => !username.startsWith("_") && !username.endsWith("_"),
        {
          message: "Username cannot start or end with underscore",
        }
      ),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /^[a-zA-Z\d@$!%*?&]+$/,
        "Password can only contain letters, numbers, and special characters (@$!%*?&)"
      ),

    password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),

    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(
        /^\+?[\d\s\-\(\)]{10,15}$/,
        "Please enter a valid mobile number (10-15 digits)"
      ),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// Login schema
export const loginSchema = z.object({
  login_identifier: z
    .string()
    .min(1, "Please enter your email, username, or mobile number"),

  password: z.string().min(1, "Password is required"),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^\+?[\d\s\-\(\)]{10,15}$/,
      "Please enter a valid mobile number (10-15 digits)"
    ),

  profile_image: z
    .string()
    .url("Please enter a valid URL for profile image")
    .optional(),
});

// Password change schema
export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),

    new_password: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])/,
        "New password must contain at least one lowercase letter"
      )
      .regex(
        /^(?=.*[A-Z])/,
        "New password must contain at least one uppercase letter"
      )
      .regex(/^(?=.*\d)/, "New password must contain at least one number")
      .regex(
        /^[a-zA-Z\d@$!%*?&]+$/,
        "New password can only contain letters, numbers, and special characters (@$!%*?&)"
      ),

    new_password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "New passwords do not match",
    path: ["new_password_confirmation"],
  });

// Post creation/update schema
export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),

  content: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
});

// creating or updating a tour review schema
export const reviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is required.",
      invalid_type_error: "Rating must be a number.",
    })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot be more than 5."),

  content: z
    .string()
    .min(1, "Review content is required.")
    .min(10, "Review must be at least 10 characters long.")
    .max(1000, "Review cannot be more than 1000 characters long."),
});

// Schema for creating or updating a post comment
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required.")
    .max(500, "Comment cannot be more than 500 characters long."),
});
