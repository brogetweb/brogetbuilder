
import express from "express";

import Property from "../models/Property.js";
import PropertyVisit from "../models/PropertyVisit.js";
import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";

import authMiddleware from "../middleware/authMiddleware.js";
import ownerMiddleware from "../middleware/ownerMiddleware.js";

const router = express.Router();

/* =========================================================
   OWNER AUTHENTICATION
========================================================= */

router.use(authMiddleware);
router.use(ownerMiddleware);

/* =========================================================
   OWNER DASHBOARD
========================================================= */

router.get("/dashboard", async (req, res) => {
  try {
    const ownerId = req.user._id;

    /* =====================================================
       OWNER PROPERTIES
    ===================================================== */

    const properties = await Property.find({
      ownerId
    }).sort({
      createdAt: -1
    });

    const propertyIds = properties.map(
      (property) => property._id
    );

    /* =====================================================
       REGISTERED USERS ONLY
       Exclude owners from the users list.
    ===================================================== */

    const registeredUsers = await User.find({
      role: { $ne: "owner" }
    })
      .select("name email role createdAt")
      .sort({
        createdAt: -1
      });

    /* =====================================================
       PROPERTY VISITS
       Actual property page views for this owner.
    ===================================================== */

    const visits = await PropertyVisit.find({
      owner: ownerId
    })
      .populate("visitor", "name email")
      .populate("property", "title city location")
      .sort({
        visitedAt: -1
      });

    /* =====================================================
       WHATSAPP ENQUIRIES
       Only enquiries for this owner's properties.
    ===================================================== */

    const enquiries = await Enquiry.find({
      property: {
        $in: propertyIds
      }
    })
      .populate("property", "title city location price")
      .sort({
        createdAt: -1
      });

    /* =====================================================
       UNIQUE PROPERTY VISITORS
    ===================================================== */

    const uniqueVisitorIds = new Set();

    visits.forEach((visit) => {
      if (visit.visitor) {
        uniqueVisitorIds.add(
          visit.visitor._id.toString()
        );
      }
    });

    /* =====================================================
       PROPERTY STATISTICS
    ===================================================== */

    const propertyStatistics = await Promise.all(
      properties.map(async (property) => {
        const propertyVisits =
          await PropertyVisit.countDocuments({
            property: property._id
          });

        const propertyEnquiries =
          await Enquiry.countDocuments({
            property: property._id
          });

        return {
          ...property.toObject(),
          views: propertyVisits,
          enquiries: propertyEnquiries
        };
      })
    );

    /* =====================================================
       DASHBOARD RESPONSE
    ===================================================== */

    res.json({
      owner: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },

      statistics: {
        // Owner's properties
        totalProperties: properties.length,

        // Registered users only; excludes role "owner"
        totalRegisteredUsers: registeredUsers.length,

        // Actual views on this owner's properties
        totalPropertyVisits: visits.length,

        // Unique users who viewed this owner's properties
        uniquePropertyVisitors: uniqueVisitorIds.size,

        // Enquiries for this owner's properties
        totalCustomers: enquiries.length
      },

      // Owner's properties with view and enquiry counts
      properties: propertyStatistics,

      // Only registered users, not owners
      recentVisitors: registeredUsers,

      // Latest enquiries for this owner's properties
      recentCustomers: enquiries.slice(0, 10)
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    res.status(500).json({
      message: "Failed to load owner dashboard"
    });
  }
});

/* =========================================================
   OWNER PROPERTIES
========================================================= */

router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.user._id
    }).sort({
      createdAt: -1
    });

    const propertyData = await Promise.all(
      properties.map(async (property) => {
        const views = await PropertyVisit.countDocuments({
          property: property._id
        });

        const enquiries = await Enquiry.countDocuments({
          property: property._id
        });

        return {
          ...property.toObject(),
          views,
          enquiries
        };
      })
    );

    res.json(propertyData);
  } catch (error) {
    console.error("Fetch owner properties error:", error);

    res.status(500).json({
      message: "Failed to fetch owner properties"
    });
  }
});

/* =========================================================
   REGISTERED USERS ONLY
   Owners are excluded from this endpoint too.
========================================================= */

router.get("/visitors", async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "owner" }
    })
      .select("name email role createdAt")
      .sort({
        createdAt: -1
      });

    res.json(users);
  } catch (error) {
    console.error("Fetch registered users error:", error);

    res.status(500).json({
      message: "Failed to fetch registered users"
    });
  }
});

/* =========================================================
   WHATSAPP CUSTOMERS / ENQUIRIES
========================================================= */

router.get("/customers", async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.user._id
    }).select("_id");

    const propertyIds = properties.map(
      (property) => property._id
    );

    const customers = await Enquiry.find({
      property: {
        $in: propertyIds
      }
    })
      .populate("property", "title city location price")
      .sort({
        createdAt: -1
      });

    res.json(customers);
  } catch (error) {
    console.error("Fetch customers error:", error);

    res.status(500).json({
      message: "Failed to fetch customers"
    });
  }
});

export default router;