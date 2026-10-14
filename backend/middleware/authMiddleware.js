import jwt from "jsonwebtoken";

import User from "../models/User.js";

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get actual user from MongoDB
    const user =
      await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Store actual database user
    // in req.user
    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message:
        "Invalid or expired token"
    });
  }
};

export default authMiddleware;