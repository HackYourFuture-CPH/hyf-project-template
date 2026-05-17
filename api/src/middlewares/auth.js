import jwt from "jsonwebtoken";

// Create a helper function that just handles the token
const getToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // If a token exists but is invalid, we throw an error
    const error = new Error("Invalid or expired token");
    error.status = 403;
    throw error;
  }
};

// Strict authentication
export const authenticate = (req, res, next) => {
  try {
    const decoded = getToken(req);
    if (!decoded) {
      const error = new Error("No token provided");
      error.status = 401;
      return next(error);
    }
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

// 3. Flexible authentication
export const optionalAuthenticate = (req, res, next) => {
  try {
    const decoded = getToken(req);
    if (decoded) {
      req.user = decoded;
    }
    next();
  } catch (err) {
    next(err);
  }
};
