// @ts-check
import { jwtVerify } from "jose";
import dotenv from "dotenv";

export async function authenticateJwt(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Access token is required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, error: "JWT_SECRET is missing" });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const userId = (payload.userId ?? payload.sub)?.toString();
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    req.user = {
      userId,
      email: String(payload.email ?? ""),
      role: String(payload.role ?? ""),
    };

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
}
