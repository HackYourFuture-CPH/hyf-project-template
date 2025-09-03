import { prisma } from "../index.js";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    const { email, name, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with email address already exists",
      });
      return;
    }
    const hashPassword = await brcypt.hash(password, 12);
    const newlCreatedUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: "VOLUNTEER",
      },
    });
    res.status(201).json({
      message: "User Created Successfully",
      userId: newlCreatedUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: "User with email address already exists",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const getCurrentUser = await prisma.user.findUnique({ where: { email } });
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
    console.error(error);
    res.status(500).json({
      success: false,
      error: "unable to Login",
    });
  }
};
