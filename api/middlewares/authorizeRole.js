const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("User is not authenticated");
      return res.status(403).json({ error: "Access denied" });
    }

    if (req.user.role !== requiredRole) {
      console.log(
        `The role does not match the required role :  ${requiredRole}`
      );
      return res
        .status(403)
        .json({ error: "User does not have the required role" });
    }
    next();
  };
};

export default authorizeRole;
