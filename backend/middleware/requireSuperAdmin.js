
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Super Admin access is required.",
    });
  }

  next();
};

export default requireSuperAdmin;