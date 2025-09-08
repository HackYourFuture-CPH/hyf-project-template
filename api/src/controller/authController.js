import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database.js";

/* concept of accesstoken and refresh token will be introduced later */
function generateToken(userId, email, role) {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );
  return { accessToken };
}
async function setToken(res, accessToken) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 1000,
    domain: "localhost",
  });
}
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await db("User").where({ email }).first();
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with email address already exists",
      });
      return;
    }

    const hashPassword = await brcypt.hash(password, 12);
    const [newlCreatedUser] = await db("User")
      .insert({
        name,
        email,
        password: hashPassword,
        role,
      })
      .returning("*");
    res.status(201).json({
      message: "User Created Successfully",
      userId: newlCreatedUser.id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Unable to register , Please tr again later",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const getCurrentUser = await db("User").where({ email }).first();

    const isCorrectPassword = await brcypt.compare(
      password,
      getCurrentUser.password
    );
    if (!getCurrentUser || !isCorrectPassword) {
      res.status(401).json({
        success: false,
        error: "User with email address Not found or password didn't match ",
      });
      return;
    }
    const { accessToken } = generateToken(
      getCurrentUser.id,
      getCurrentUser.email,
      getCurrentUser.role
    );
    await setToken(res, accessToken);
    res.status(201).json({
      message: "Login Successful",
      user: {
        id: getCurrentUser.id,
        email: getCurrentUser.email,
        name: getCurrentUser.name,
        role: getCurrentUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to Login",
    });
  }
};

export const logOut = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: "localhost",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logout Successfully",
  });
};
