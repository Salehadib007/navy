const accessMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.access.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Access denied",
        requiredPermission,
      });
    }

    next();
  };
};

export default accessMiddleware;
