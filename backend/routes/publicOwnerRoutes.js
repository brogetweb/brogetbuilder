// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/User.js";
// import Property from "../models/Property.js";

// const router = express.Router();

// // GET /api/public/owners
// // Fetch only approved registered owners
// router.get("/", async (req, res) => {
//   try {
//     const owners = await User.find({
//       role: "owner",
//       approvalStatus: "approved",
//     })
//       .select("_id name email createdAt")
//       .sort({ name: 1 })
//       .lean();

//     // Add property count for each approved owner
//     const ownersWithCounts = await Promise.all(
//       owners.map(async (owner) => {
//         const propertyCount = await Property.countDocuments({
//           ownerName: owner.name,
//         });

//         return {
//           ...owner,
//           propertyCount,
//         };
//       })
//     );

//     return res.status(200).json(ownersWithCounts);
//   } catch (error) {
//     console.error("Fetch approved owners error:", error);

//     return res.status(500).json({
//       message: "Failed to fetch approved owners",
//     });
//   }
// });

// // GET /api/public/owners/:ownerId/properties
// // Fetch properties only for approved owners
// router.get("/:ownerId/properties", async (req, res) => {
//   try {
//     const { ownerId } = req.params;

//     if (!mongoose.isValidObjectId(ownerId)) {
//       return res.status(400).json({
//         message: "Invalid owner ID",
//       });
//     }

//     // Verify that the owner is approved
//     const owner = await User.findOne({
//       _id: ownerId,
//       role: "owner",
//       approvalStatus: "approved",
//     })
//       .select("_id name email")
//       .lean();

//     if (!owner) {
//       return res.status(404).json({
//         message: "Approved owner not found",
//       });
//     }

//     // Fetch properties belonging to this owner
//     const properties = await Property.find({
//       ownerName: owner.name,
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

// export default router;


import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Project from "../models/Project.js";

const router = express.Router();

// GET /api/public/owners
// Fetch approved owners with property and project counts
router.get("/", async (req, res) => {
  try {
    const owners = await User.find({
      role: "owner",
      approvalStatus: "approved",
    })
      .select("_id name email createdAt")
      .sort({ name: 1 })
      .lean();

    const ownersWithCounts = await Promise.all(
      owners.map(async (owner) => {
        const [propertyCount, projectCount] = await Promise.all([
          Property.countDocuments({
            ownerName: owner.name,
          }),

          Project.countDocuments({
            ownerId: owner._id,
          }),
        ]);

        return {
          ...owner,
          propertyCount,
          projectCount,
          totalListings: propertyCount + projectCount,
        };
      })
    );

    return res.status(200).json(ownersWithCounts);
  } catch (error) {
    console.error("Fetch approved owners error:", error);

    return res.status(500).json({
      message: "Failed to fetch approved owners",
    });
  }
});

// GET /api/public/owners/:ownerId/properties
// Fetch properties and projects for one approved owner
router.get("/:ownerId/properties", async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({
        message: "Invalid owner ID",
      });
    }

    const owner = await User.findOne({
      _id: ownerId,
      role: "owner",
      approvalStatus: "approved",
    })
      .select("_id name email")
      .lean();

    if (!owner) {
      return res.status(404).json({
        message: "Approved owner not found",
      });
    }

    const [properties, projects] = await Promise.all([
      Property.find({
        ownerName: owner.name,
      })
        .sort({ createdAt: -1 })
        .lean(),

      Project.find({
        ownerId: owner._id,
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      owner,
      properties,
      projects,
      propertyCount: properties.length,
      projectCount: projects.length,
      totalListings: properties.length + projects.length,
    });
  } catch (error) {
    console.error("Fetch owner listings error:", error);

    return res.status(500).json({
      message: "Failed to fetch owner properties and projects",
    });
  }
});

export default router;
