const ownerMiddleware = (
  req,
  res,
  next
) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({
      message:
        "Only property owners can post properties"
    });
  }

  next();
};

export default ownerMiddleware;