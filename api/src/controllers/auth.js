import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import knex from "#configs/database.js";

//POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.status = 400;
      throw error;
    }

    // 2. Check if user already exists
    const existingUser = await knex("user").where({ email }).first();
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.status = 409; // Conflict
      throw error;
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into database
    const [newUser] = await knex("user")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning(["id", "name", "email"]);

    // 5. Success response
    res.status(201).json({
      data: newUser,
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

//POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the "user" table
    const user = await knex("user").where({ email }).first();

    // 2. If user doesn't exist, return a generic error (for security)
    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    // 3. Compare the provided password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Send the token to the client
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // The middleware already put the user ID in req.user
    const user = await knex("user")
      .where({ id: req.user.id })
      .select("id", "name", "email")
      .first();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
