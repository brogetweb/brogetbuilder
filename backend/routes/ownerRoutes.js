import express from "express";

import Property from "../models/Property.js";
import Project from "../models/Project.js";
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
      ownerId,
    }).sort({
      createdAt: -1,
    });

    const propertyIds = properties.map(
      (property) => property._id
    );

    /* =====================================================
       OWNER PROJECTS

       IMPORTANT:
       This assumes Project uses an ownerId field.
    ===================================================== */

    const projects = await Project.find({
      ownerId,
    }).sort({
      createdAt: -1,
    });

    /* =====================================================
       REGISTERED USERS
    ===================================================== */

    const registeredUsers = await User.find({
      role: {
        $nin: ["owner", "superadmin"],
      },
    })
      .select("name email role createdAt")
      .sort({
        createdAt: -1,
      });

    /* =====================================================
       PROPERTY VISITS

       Actual property visits for this owner.
    ===================================================== */

    const visits = await PropertyVisit.find({
      owner: ownerId,
    })
      .populate("visitor", "name email")
      .populate("property", "title city location")
      .sort({
        visitedAt: -1,
      });

    /* =====================================================
       PROPERTY ENQUIRIES

       Only enquiries for this owner's properties.
    ===================================================== */

    const enquiries = await Enquiry.find({
      property: {
        $in: propertyIds,
      },
    })
      .populate(
        "property",
        "title city location price"
      )
      .sort({
        createdAt: -1,
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
            property: property._id,
          });

        const propertyEnquiries =
          await Enquiry.countDocuments({
            property: property._id,
          });

        return {
          ...property.toObject(),
          views: propertyVisits,
          enquiries: propertyEnquiries,
        };
      })
    );

    /* =====================================================
       DASHBOARD RESPONSE
    ===================================================== */

    return res.json({
      owner: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },

      statistics: {
        totalProperties: properties.length,

        totalProjects: projects.length,

        registeredUsers: registeredUsers.length,

        totalRegisteredUsers: registeredUsers.length,

        totalPropertyVisits: visits.length,

        uniquePropertyVisitors: uniqueVisitorIds.size,

        totalCustomers: enquiries.length,

        // Keep the existing favourite count compatible
        // with the frontend. Add a real calculation if
        // your application stores owner-specific favourites.
        totalFavourites: 0,
      },

      // Owner's properties with visit and enquiry counts
      properties: propertyStatistics,

      // Only projects belonging to this owner
      projects,

      // Registered customer accounts
      recentVisitors: registeredUsers,

      // Latest enquiries for this owner's properties
      recentCustomers: enquiries.slice(0, 10),
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);

    return res.status(500).json({
      message: "Failed to load owner dashboard",
    });
  }
});

/* =========================================================
   OWNER PROPERTIES
========================================================= */

router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const propertyData = await Promise.all(
      properties.map(async (property) => {
        const views = await PropertyVisit.countDocuments({
          property: property._id,
        });

        const enquiries = await Enquiry.countDocuments({
          property: property._id,
        });

        return {
          ...property.toObject(),
          views,
          enquiries,
        };
      })
    );

    return res.json(propertyData);
  } catch (error) {
    console.error("Fetch owner properties error:", error);

    return res.status(500).json({
      message: "Failed to fetch owner properties",
    });
  }
});

/* =========================================================
   OWNER PROJECTS
========================================================= */

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({
      ownerId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json(projects);
  } catch (error) {
    console.error("Fetch owner projects error:", error);

    return res.status(500).json({
      message: "Failed to fetch owner projects",
    });
  }
});

/* =========================================================
   REGISTERED USERS
   Exclude owners and superadmins.
========================================================= */

router.get("/visitors", async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $nin: ["owner", "superadmin"],
      },
    })
      .select("name email role createdAt")
      .sort({
        createdAt: -1,
      });

    return res.json(users);
  } catch (error) {
    console.error("Fetch registered users error:", error);

    return res.status(500).json({
      message: "Failed to fetch registered users",
    });
  }
});

/* =========================================================
   WHATSAPP CUSTOMERS / PROPERTY ENQUIRIES
========================================================= */

router.get("/customers", async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.user._id,
    }).select("_id");

    const propertyIds = properties.map(
      (property) => property._id
    );

    const customers = await Enquiry.find({
      property: {
        $in: propertyIds,
      },
    })
      .populate(
        "property",
        "title city location price"
      )
      .sort({
        createdAt: -1,
      });

    return res.json(customers);
  } catch (error) {
    console.error("Fetch customers error:", error);

    return res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
});

export default router;
