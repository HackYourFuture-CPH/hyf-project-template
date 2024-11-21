const authorizeRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    console.log("User not authenticated");
    return res.status(403).json({ error: "Access denied" });
  }

  if (req.user.role !== requiredRole) {
    console.log(
      `User role ${req.user.role} does not match required role ${requiredRole}`
    );
    return res.status(403).json({ error: "Forbidden: Role Access denied" });
  }

  next();
};

export default authorizeRole;
