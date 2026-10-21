// working for property visit

// import express from "express";
// import mongoose from "mongoose";

// import Property from "../models/Property.js";
// import PropertyVisit from "../models/PropertyVisit.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // POST /api/visits/:propertyId
// // Supports logged-in and anonymous visitors.

// // Authenticate only when a token is provided.
// // Guests can continue without a token.
// const optionalAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     return next();
//   }

//   return authMiddleware(req, res, next);
// };

// router.post("/:propertyId", optionalAuth, async (req, res) => {
//   try {
//     const { propertyId } = req.params;
//     const { anonymousVisitorId } = req.body;

//     // Validate property ID.
//     if (!mongoose.Types.ObjectId.isValid(propertyId)) {
//       return res.status(400).json({
//         message: "Invalid property ID",
//       });
//     }

//     // Find property.
//     const property = await Property.findById(propertyId);

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found",
//       });
//     }

//     // Support either ownerId or owner, depending on the Property schema.
//     let ownerId = property.ownerId || property.owner;

//     if (ownerId && ownerId._id) {
//       ownerId = ownerId._id;
//     }

//     if (
//       !ownerId ||
//       !mongoose.Types.ObjectId.isValid(ownerId.toString())
//     ) {
//       return res.status(400).json({
//         message: "Property owner not found",
//       });
//     }

//     // Get the authenticated visitor from authMiddleware.
//     const user = req.user;
//     let visitorId = user?._id || user?.id || null;

//     if (
//       visitorId &&
//       !mongoose.Types.ObjectId.isValid(visitorId.toString())
//     ) {
//       return res.status(401).json({
//         message: "Invalid authenticated visitor ID",
//       });
//     }

//     // If the owner views their own property, don't record the visit.
//     if (
//       visitorId &&
//       ownerId.toString() === visitorId.toString()
//     ) {
//       return res.status(200).json({
//         message: "Owner visit not recorded",
//       });
//     }

//     // Guests must provide an anonymous visitor ID.
//     if (!visitorId && !anonymousVisitorId) {
//       return res.status(400).json({
//         message: "Anonymous visitor ID is required",
//       });
//     }

//     // Save visit using the existing model.
//     const visit = await PropertyVisit.create({
//       property: property._id,
//       owner: ownerId,
//       visitor: visitorId || undefined,
//       anonymousVisitorId: visitorId
//         ? undefined
//         : String(anonymousVisitorId).slice(0, 100),
//       visitedAt: new Date(),
//     });

//     return res.status(201).json({
//       message: "Property visit recorded successfully",
//       visitId: visit._id,
//     });
//   } catch (error) {
//     console.error("PROPERTY VISIT ERROR:", error);

//     return res.status(500).json({
//       message: "Failed to record property visit",
//       error: error.message,
//     });
//   }
// });

// export default router;


import express from "express";
import mongoose from "mongoose";

import Property from "../models/Property.js";
import Project from "../models/Project.js";
import PropertyVisit from "../models/PropertyVisit.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticate requests only when a token is supplied.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  return authMiddleware(req, res, next);
};

// POST /api/visits/:propertyId
// Body: { entityType: "property" } or { entityType: "project" }
router.post("/:propertyId", optionalAuth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      entityType = "property",
      anonymousVisitorId,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        message: "Invalid property or project ID",
      });
    }

    if (!["property", "project"].includes(entityType)) {
      return res.status(400).json({
        message: "Invalid entity type",
      });
    }

    let listing;
    let ownerId;

    if (entityType === "project") {
      listing = await Project.findById(propertyId);

      if (!listing) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
    } else {
      listing = await Property.findById(propertyId);

      if (!listing) {
        return res.status(404).json({
          message: "Property not found",
        });
      }
    }

    // Match the owner field used by your existing schemas.
    ownerId = listing.ownerId || listing.owner;

    if (ownerId?._id) {
      ownerId = ownerId._id;
    }

    if (
      !ownerId ||
      !mongoose.Types.ObjectId.isValid(ownerId.toString())
    ) {
      return res.status(400).json({
        message: "Listing owner not found",
      });
    }

    const visitorId = req.user?._id || req.user?.id || null;

    if (
      visitorId &&
      !mongoose.Types.ObjectId.isValid(visitorId.toString())
    ) {
      return res.status(401).json({
        message: "Invalid visitor ID",
      });
    }

    // Don't count the owner's own visits.
    if (
      visitorId &&
      ownerId.toString() === visitorId.toString()
    ) {
      return res.status(200).json({
        message: "Owner visit not recorded",
      });
    }

    // Guest visits require an anonymous ID.
    if (!visitorId && !anonymousVisitorId) {
      return res.status(400).json({
        message: "Anonymous visitor ID is required",
      });
    }

    const visitData = {
      owner: ownerId,
      visitor: visitorId || null,
      anonymousVisitorId: visitorId
        ? null
        : String(anonymousVisitorId).slice(0, 100),
      visitedAt: new Date(),
    };

    if (entityType === "project") {
      visitData.project = listing._id;
      visitData.property = null;
    } else {
      visitData.property = listing._id;
      visitData.project = null;
    }

    const visit = await PropertyVisit.create(visitData);

    return res.status(201).json({
      message: "Visit recorded successfully",
      visitId: visit._id,
      entityType,
    });
  } catch (error) {
    console.error("VISIT TRACKING ERROR:", error);

    return res.status(500).json({
      message: "Failed to record visit",
      error: error.message,
    });
  }
});

export default router;
