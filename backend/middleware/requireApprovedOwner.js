
const requireApprovedOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({
      message: "Only property owners can access this feature.",
    });
  }

  if (req.user.approvalStatus === "pending") {
    return res.status(403).json({
      message: "Your owner application is under review.",
      approvalStatus: "pending",
    });
  }

  if (req.user.approvalStatus === "rejected") {
    return res.status(403).json({
      message: "Your owner application was not approved.",
      approvalStatus: "rejected",
      rejectionReason: req.user.rejectionReason || "",
    });
  }

  if (req.user.approvalStatus !== "approved") {
    return res.status(403).json({
      message: "Your owner account has not been approved.",
    });
  }

  next();
};

export default requireApprovedOwner;