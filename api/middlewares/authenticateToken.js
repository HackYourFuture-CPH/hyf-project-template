import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // console.log("Cookies received:", req.cookies);
  // console.log("Headers received:", req.headers);

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    // console.log("No token found");
    return res.status(403).json({ error: "Access denied" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }
    // console.log("Token verified successfully for user:", user.id);
    req.user = user;
    next();
  });
};

export default authenticateToken;
