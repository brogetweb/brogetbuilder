
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";

const router = express.Router();

// GET /api/public/owners
// Fetch all registered owners using only the User schema
// router.get("/", async (req, res) => {
//   try {
//     const owners = await User.find({ role: "owner" })
//       .select("_id name email createdAt")
//       .sort({ name: 1 })
//       .lean();

//     return res.status(200).json(owners);
//   } catch (error) {
//     console.error("Fetch owners error:", error);

//     return res.status(500).json({
//       message: "Failed to fetch registered owners",
//     });
//   }
// });


router.get("/", async (req, res) => {
  try {
    // Fetch registered owners from User schema
    const owners = await User.find({ role: "owner" })
      .select("_id name email createdAt")
      .sort({ name: 1 })
      .lean();

    // Add property count by matching ownerName
    const ownersWithCounts = await Promise.all(
      owners.map(async (owner) => {
        const propertyCount = await Property.countDocuments({
          ownerName: owner.name,
        });

        return {
          ...owner,
          propertyCount,
        };
      })
    );

    return res.status(200).json(ownersWithCounts);
  } catch (error) {
    console.error("Fetch owners error:", error);

    return res.status(500).json({
      message: "Failed to fetch registered owners",
    });
  }
});

// GET /api/public/owners/:ownerId/properties
// Fetch properties when a visitor selects an owner
// router.get("/:ownerId/properties", async (req, res) => {
//   try {
//     const { ownerId } = req.params;

//     if (!mongoose.isValidObjectId(ownerId)) {
//       return res.status(400).json({
//         message: "Invalid owner ID",
//       });
//     }

//     const owner = await User.findOne({
//       _id: ownerId,
//       role: "owner",
//     })
//       .select("_id name")
//       .lean();

//     if (!owner) {
//       return res.status(404).json({
//         message: "Owner not found",
//       });
//     }

//     const properties = await Property.find({
//       ownerId: owner._id,
//     }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       owner,
//       properties,
//     });
//   } catch (error) {
//     console.error("Fetch owner properties error:", error);

//     return res.status(500).json({
//       message: "Failed to fetch owner properties",
//     });
//   }
// });


router.get("/:ownerId/properties", async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({
        message: "Invalid owner ID",
      });
    }

    // Find the registered owner in the users collection
    const owner = await User.findOne({
      _id: ownerId,
      role: "owner",
    })
      .select("_id name email")
      .lean();

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    // Fetch properties using the owner's name
    const properties = await Property.find({
      ownerName: owner.name,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      owner,
      properties,
    });
  } catch (error) {
    console.error("Fetch owner properties error:", error);

    return res.status(500).json({
      message: "Failed to fetch owner properties",
    });
  }
});

export default router;