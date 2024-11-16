import jwt from "jsonwebtoken";

export function authenticate(requiredRole = null) {
  return function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
