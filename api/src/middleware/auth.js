import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to optionally check for a JWT token
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token, continue without a user object
  if (!token) {
    return next();
  }

  // If token is present, verify it but don't block if invalid, just proceed without user
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

// Middleware to generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Optional: Middleware to check if user has specific role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role || "user";
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};
