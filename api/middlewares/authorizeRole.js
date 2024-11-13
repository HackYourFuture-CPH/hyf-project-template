const authorizeRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: "Forbidden: Role Access denied" });
  }

  next();
};

export default authorizeRole;
