// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";

// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // =====================================
// // REGISTER
// // =====================================

// router.post("/register", async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role
//     } = req.body;

//     // Check required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: "Please fill all required fields"
//       });
//     }

//     // Check valid role
//     if (
//       role &&
//       !["user", "owner"].includes(role)
//     ) {
//       return res.status(400).json({
//         message: "Invalid role"
//       });
//     }

//     // Check if user already exists
//     const existingUser =
//       await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists"
//       });
//     }

//     // Hash password
//     const hashedPassword =
//       await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || "user"
//     });

//     // Create token
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d"
//       }
//     );

//     res.status(201).json({
//       message: "Registration successful",

//       token,

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Registration failed"
//     });
//   }
// });

// // =====================================
// // LOGIN
// // =====================================

// router.post("/login", async (req, res) => {
//   try {
//     const {
//       email,
//       password,
//       role
//     } = req.body;

//     // Check fields
//     if (!email || !password || !role) {
//       return res.status(400).json({
//         message:
//           "Please enter email, password and login role"
//       });
//     }

//     // Check valid role
//     if (
//       !["user", "owner"].includes(role)
//     ) {
//       return res.status(400).json({
//         message: "Invalid login role"
//       });
//     }

//     // Find user from MongoDB
//     const user =
//       await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     // Check password
//     const isPasswordCorrect =
//       await bcrypt.compare(
//         password,
//         user.password
//       );

//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     // =====================================
//     // CHECK ROLE FROM MONGODB
//     // =====================================

//     if (user.role !== role) {
//       return res.status(403).json({
//         message:
//           `This account is not registered as a ${role}.`
//       });
//     }

//     // =====================================
//     // CREATE TOKEN
//     // =====================================

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d"
//       }
//     );

//     res.json({
//       message: "Login successful",

//       token,

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Login failed"
//     });
//   }
// });

// // =====================================
// // GET CURRENT USER
// // =====================================

// router.get(
//   "/me",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       res.json({
//         user: {
//           id: req.user._id,
//           name: req.user.name,
//           email: req.user.email,
//           role: req.user.role
//         }
//       });
//     } catch (error) {
//       console.log(error);

//       res.status(500).json({
//         message: "Failed to fetch user"
//       });
//     }
//   }
// );

// export default router;
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// HELPER: CREATE JWT TOKEN
// =====================================
const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =====================================
// HELPER: SAFE USER RESPONSE
// Never return the password.
// =====================================
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  approvalStatus: user.approvalStatus || "not_required",
  rejectionReason: user.rejectionReason || "",
});

// =====================================
// REGISTER
// =====================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Only customer and owner registration are allowed.
    // Super Admin accounts must be created securely by an admin.
    const selectedRole = role || "user";

    if (!["user", "owner"].includes(selectedRole)) {
      return res.status(400).json({
        message: "Invalid registration role.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for an existing account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Owner accounts ALWAYS start as pending.
    // Customer accounts do not require approval.
    const approvalStatus =
      selectedRole === "owner" ? "pending" : "not_required";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: selectedRole,
      approvalStatus,
      rejectionReason: "",
    });

    const token = createToken(user);

    return res.status(201).json({
      message:
        selectedRole === "owner"
          ? "Registration successful. Your owner application is under review."
          : "Registration successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate-email race conditions
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// =====================================
// LOGIN
// =====================================
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "Please enter email, password and login role.",
      });
    }

    // Super Admin is allowed to log in, but cannot register publicly.
    if (!["user", "owner", "superadmin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid login role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Use a generic message for incorrect credentials
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Verify the requested role against MongoDB
    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is not registered as a ${role}.`,
      });
    }

    // Create a token only after validating credentials and role.
    // Pending/rejected owners may log in so they can view their status.
    const token = createToken(user);

    let message = "Login successful.";

    if (
      user.role === "owner" &&
      user.approvalStatus === "pending"
    ) {
      message =
        "Your owner application is under review. We will update you within 24 hours.";
    } else if (
      user.role === "owner" &&
      user.approvalStatus === "rejected"
    ) {
      message = "Your owner application was not approved.";
    } else if (
      user.role === "owner" &&
      user.approvalStatus !== "approved"
    ) {
      message =
        "Your owner account is awaiting approval status verification.";
    }

    return res.json({
      message,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

// =====================================
// GET CURRENT USER
// Returns fresh data from MongoDB.
// =====================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // authMiddleware should load the current user from MongoDB.
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Failed to fetch user.",
    });
  }
});

export default router;