const authorizeRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    console.log("User is not authenticated");
    return res.status(403).json({ error: "Access denied." });
  }

  if (req.user.role !== requiredRole) {
    console.log(`User does not have the required role i.e ${requiredRole}`);
    return res
      .status(403)
      .json({ error: "Role Access has been denied denied" });
  }

  next();
};

export default authorizeRole;
