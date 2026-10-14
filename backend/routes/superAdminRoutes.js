
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";

const router = express.Router();

// All routes in this file require an authenticated Super Admin.
router.use(authMiddleware, requireSuperAdmin);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [
      users,
      owners,
      superadmins,
      pendingOwners,
      approvedOwners,
      rejectedOwners,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "owner" }),
      User.countDocuments({ role: "superadmin" }),
      User.countDocuments({
        role: "owner",
        approvalStatus: "pending",
      }),
      User.countDocuments({
        role: "owner",
        approvalStatus: "approved",
      }),
      User.countDocuments({
        role: "owner",
        approvalStatus: "rejected",
      }),
    ]);

    return res.json({
      users,
      owners,
      superadmins,
      pendingOwners,
      approvedOwners,
      rejectedOwners,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({
      message: "Failed to load dashboard statistics.",
    });
  }
});

// GET /api/admin/owner-applications?status=pending
router.get("/owner-applications", async (req, res) => {
  try {
    const allowedStatuses = ["pending", "approved", "rejected", "all"];
    const status = req.query.status || "pending";

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const filter = { role: "owner" };

    if (status !== "all") {
      filter.approvalStatus = status;
    }

    const applications = await User.find(filter)
      .select(
        "name email approvalStatus rejectionReason createdAt reviewedAt reviewedBy"
      )
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ applications });
  } catch (error) {
    console.error("Fetch owner applications error:", error);
    return res.status(500).json({
      message: "Failed to fetch owner applications.",
    });
  }
});

// PATCH /api/admin/owner-applications/:id/approve
router.patch("/owner-applications/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid owner application ID.",
      });
    }

    const owner = await User.findOneAndUpdate(
      {
        _id: id,
        role: "owner",
        approvalStatus: "pending",
      },
      {
        $set: {
          approvalStatus: "approved",
          rejectionReason: "",
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).select("name email role approvalStatus reviewedAt");

    if (!owner) {
      return res.status(404).json({
        message: "Pending owner application not found.",
      });
    }

    return res.json({
      message: "Owner application approved successfully.",
      owner,
    });
  } catch (error) {
    console.error("Approve owner error:", error);
    return res.status(500).json({
      message: "Failed to approve owner application.",
    });
  }
});

// PATCH /api/admin/owner-applications/:id/reject
router.patch("/owner-applications/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const reason =
      typeof req.body.reason === "string" ? req.body.reason.trim() : "";

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid owner application ID.",
      });
    }

    if (!reason) {
      return res.status(400).json({
        message: "Please provide a reason for rejection.",
      });
    }

    const owner = await User.findOneAndUpdate(
      {
        _id: id,
        role: "owner",
        approvalStatus: "pending",
      },
      {
        $set: {
          approvalStatus: "rejected",
          rejectionReason: reason,
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).select("name email role approvalStatus rejectionReason reviewedAt");

    if (!owner) {
      return res.status(404).json({
        message: "Pending owner application not found.",
      });
    }

    return res.json({
      message: "Owner application rejected.",
      owner,
    });
  } catch (error) {
    console.error("Reject owner error:", error);
    return res.status(500).json({
      message: "Failed to reject owner application.",
    });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role approvalStatus createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ users });
  } catch (error) {
    console.error("Fetch admin users error:", error);
    return res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
});

export default router;