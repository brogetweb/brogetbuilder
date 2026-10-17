
import express from "express";
import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/contact
// Public endpoint: save a contact enquiry
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        message: "Please fill in all contact form fields.",
      });
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!validEmail) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (name.trim().length > 100 || message.trim().length > 3000) {
      return res.status(400).json({
        message: "The name or message exceeds the allowed length.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return res.status(201).json({
      message: "Your enquiry has been submitted successfully.",
      enquiryId: contactMessage._id,
    });
  } catch (error) {
    console.error("Save contact enquiry error:", error);

    return res.status(500).json({
      message: "Unable to submit your enquiry. Please try again.",
    });
  }
});

// GET /api/contact
// Super Admin only: fetch enquiries
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({
        message: "Only the Super Admin can view contact enquiries.",
      });
    }

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch contact enquiries error:", error);

    return res.status(500).json({
      message: "Unable to fetch contact enquiries.",
    });
  }
});

// PATCH /api/contact/:id/read
// Super Admin only: mark an enquiry as read
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({
        message: "Only the Super Admin can update enquiries.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid enquiry ID.",
      });
    }

    const enquiry = await ContactMessage.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        message: "Contact enquiry not found.",
      });
    }

    return res.status(200).json({
      message: "Enquiry marked as read.",
      enquiry,
    });
  } catch (error) {
    console.error("Update contact enquiry error:", error);

    return res.status(500).json({
      message: "Unable to update the enquiry.",
    });
  }
});

export default router;
