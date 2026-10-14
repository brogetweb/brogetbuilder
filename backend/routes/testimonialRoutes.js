
import express from "express";
import mongoose from "mongoose";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// TESTIMONIAL MODEL
// Defined inside this routes file
// ==========================================

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);

// ==========================================
// SUPER ADMIN MIDDLEWARE
// Uses the authenticated database user
// ==========================================

const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  // Change "superadmin" if your User model
  // uses a different super-admin role value.
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Access denied. Super admin only.",
    });
  }

  next();
};

// ==========================================
// 1. GET APPROVED TESTIMONIALS
// GET /api/testimonials
// Public route
// ==========================================

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      status: "approved",
    }).sort({
      reviewedAt: -1,
      createdAt: -1,
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    console.error("Fetch testimonials error:", error);

    return res.status(500).json({
      message: "Failed to fetch testimonials",
    });
  }
});

// ==========================================
// 2. SUBMIT TESTIMONIAL
// POST /api/testimonials
// Public route
// Every new review starts as pending
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Name and review are required",
      });
    }

    if (
      name.trim().length > 80 ||
      message.trim().length > 1000
    ) {
      return res.status(400).json({
        message: "Name or review exceeds the allowed length",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      rating: numericRating,
      message: message.trim(),
      status: "pending",
    });

    return res.status(201).json({
      message:
        "Your review has been submitted successfully and is awaiting super-admin approval.",
      testimonial,
    });
  } catch (error) {
    console.error("Submit testimonial error:", error);

    return res.status(500).json({
      message: "Failed to submit testimonial",
    });
  }
});

// ==========================================
// 3. GET PENDING TESTIMONIALS
// GET /api/testimonials/admin/pending
// Super-admin only
// ==========================================

router.get(
  "/admin/pending",
  authMiddleware,
  superAdminOnly,
  async (req, res) => {
    try {
      const testimonials = await Testimonial.find({
        status: "pending",
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json(testimonials);
    } catch (error) {
      console.error("Pending testimonials error:", error);

      return res.status(500).json({
        message: "Failed to fetch pending testimonials",
      });
    }
  }
);

// ==========================================
// 4. APPROVE OR REJECT TESTIMONIAL
// PATCH /api/testimonials/admin/:id/review
// Super-admin only
// ==========================================

router.patch(
  "/admin/:id/review",
  authMiddleware,
  superAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "Invalid testimonial ID",
        });
      }

      if (
        !["approved", "rejected"].includes(status)
      ) {
        return res.status(400).json({
          message: "Status must be approved or rejected",
        });
      }

      // Only pending reviews can be reviewed.
      const testimonial = await Testimonial.findOneAndUpdate(
        {
          _id: id,
          status: "pending",
        },
        {
          $set: {
            status,
            reviewedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!testimonial) {
        return res.status(404).json({
          message:
            "Pending testimonial not found. It may already have been reviewed.",
        });
      }

      return res.status(200).json({
        message:
          status === "approved"
            ? "Testimonial approved and published successfully."
            : "Testimonial rejected successfully.",
        testimonial,
      });
    } catch (error) {
      console.error("Review testimonial error:", error);

      return res.status(500).json({
        message: "Failed to update testimonial",
      });
    }
  }
);

export default router;
