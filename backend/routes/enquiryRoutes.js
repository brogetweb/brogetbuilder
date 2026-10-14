import express from "express";

import Enquiry from "../models/Enquiry.js";

const router = express.Router();

/* =========================================================
   CREATE ENQUIRY
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      property,
      name,
      email,
      phone,
      message
    } = req.body;

    if (
      !property ||
      !name ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Property, name and phone are required"
      });
    }

    const enquiry =
      await Enquiry.create({
        property,
        name,
        email,
        phone,
        message
      });

    res.status(201).json({
      message:
        "Enquiry saved successfully",
      enquiry
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to save enquiry"
    });
  }
});

/* =========================================================
   GET ALL ENQUIRIES
========================================================= */

router.get("/", async (req, res) => {
  try {
    const enquiries =
      await Enquiry.find({})
        .populate(
          "property",
          "title city location price ownerId"
        )
        .sort({
          createdAt: -1
        });

    res.json(enquiries);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch enquiries"
    });
  }
});

export default router;