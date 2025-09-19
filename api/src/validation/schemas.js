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

// Schema for adding a new favorite
export const favoriteSchema = z.object({
  item_id: z.string().uuid("A valid item ID is required."),
  item_type: z.enum(["tour", "post", "attraction"], {
    required_error: "Item type is required.",
    invalid_type_error:
      "Item type must be one of 'tour', 'post', or 'attraction'.",
  }),
});

// Schema for a user creating or updating a blog post
export const userPostSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(3, "Title must be at least 3 characters long.")
    .max(255, "Title cannot be more than 255 characters."),
  content: z
    .string({ required_error: "Content is required." })
    .min(10, "The post content must be at least 10 characters long."),
  category: z.string().optional().nullable(),
});

// --- ADMIN SCHEMAS ---

// Schema for an admin creating a user
export const adminUserCreateSchema = z.object({
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

  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^\+?[\d\s\-\(\)]{10,15}$/,
      "Please enter a valid mobile number (10-15 digits)"
    ),

  role: z
    .enum(["user", "admin", "moderator"], {
      errorMap: () => ({ message: "Please select a valid role." }),
    })
    .default("user"),
});

// Schema for an admin updating a user's details
export const adminUserUpdateSchema = z.object({
  role: z
    .enum(["user", "admin", "moderator"], {
      errorMap: () => ({ message: "Please select a valid role." }),
    })
    .optional(),
  is_active: z
    .boolean({
      errorMap: () => ({ message: "Status must be either true or false." }),
    })
    .optional(),
});

// Schema for an admin CREATING a tour
export const adminTourCreateSchema = z.object({
  name: z
    .string({ required_error: "Tour name is required." })
    .min(3, "The name must be at least 3 characters long.")
    .max(100),
  description: z
    .string({ required_error: "A description is required." })
    .min(10, "The description must be at least 10 characters long."),
  start_date: z.string().optional().nullable(),
  duration_days: z
    .number({ required_error: "Please provide the tour's duration." })
    .int()
    .min(1),
  price_minor: z.number({ required_error: "Please set a price." }).int().min(0),
  currency_code: z
    .string({ required_error: "A currency code is required." })
    .length(3, "The currency code must be 3 characters."),
  capacity: z
    .number({ required_error: "Please specify the tour capacity." })
    .int()
    .min(1),
  cover_image_url: z
    .string()
    .url("Please provide a valid URL for the cover image.")
    .optional()
    .nullable(),
  destinations: z
    .array(
      z.object({
        city_name: z.string().min(1, "City name is required."),
        country_name: z.string().min(1, "Country name is required."),
        duration_days: z
          .number()
          .int()
          .min(1, "Duration must be at least 1 day."),
      })
    )
    .optional(),
});

// Schema for an admin UPDATING a tour.
export const adminTourUpdateSchema = adminTourCreateSchema.partial();

// Schema for an admin creating or updating a post
export const adminPostSchema = z.object({
  title: z
    .string({ required_error: "A title is required for the post." })
    .min(3, "The title must be at least 3 characters long.")
    .max(255, "The title cannot be more than 255 characters."),
  content: z
    .string()
    .min(10, "The post content must be at least 10 characters long."),
  category: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
});

// Schema for an admin creating or updating an attraction
export const adminAttractionSchema = z.object({
  title: z
    .string({ required_error: "A title is required for the attraction." })
    .min(3, "The title must be at least 3 characters long.")
    .max(255, "The title cannot be more than 255 characters."),
  content: z
    .string()
    .min(10, "The content must be at least 10 characters long."),
  location: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
});
