import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ownerMiddleware from "../middleware/ownerMiddleware.js";

const router = express.Router();

const PROJECT_STATUSES = [
  "New Launch",
  "Under Construction",
  "Ready to Move",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "Independent House",
];

// Fields accepted when creating or updating a project.
const PROJECT_FIELDS = [
  "name",
  "builder",
  "description",
  "location",
  "city",
  "propertyType",
  "configurations",
  "minPrice",
  "maxPrice",
  "area",
  "status",
  "possession",
  "amenities",
  "images",
  "contactName",
  "contactNumber",
];

const REQUIRED_FIELDS = [
  "name",
  "builder",
  "description",
  "location",
  "city",
  "propertyType",
  "minPrice",
  "maxPrice",
  "area",
  "status",
  "possession",
  "contactName",
  "contactNumber",
];

const ARRAY_FIELDS = [
  "configurations",
  "amenities",
  "images",
];

// Escape special characters before using user input in a regex.
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Build an object containing only permitted project fields.
const pickProjectFields = (body) => {
  const result = {};

  for (const field of PROJECT_FIELDS) {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
  }

  return result;
};

// Validate fields supplied for creation or update.
const validateProjectData = (data, isCreate = false) => {
  if (isCreate) {
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = data[field];

      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      );
    });

    if (missingFields.length > 0) {
      return {
        error: "Please fill all required fields",
        missingFields,
      };
    }
  }

  for (const field of [
    "name",
    "builder",
    "description",
    "location",
    "city",
    "area",
    "possession",
    "contactName",
    "contactNumber",
  ]) {
    if (
      data[field] !== undefined &&
      (typeof data[field] !== "string" ||
        data[field].trim() === "")
    ) {
      return {
        error: `${field} must be a non-empty string`,
      };
    }
  }

  if (
    data.propertyType !== undefined &&
    !PROPERTY_TYPES.includes(data.propertyType)
  ) {
    return { error: "Invalid property type" };
  }

  if (
    data.status !== undefined &&
    !PROJECT_STATUSES.includes(data.status)
  ) {
    return { error: "Invalid project status" };
  }

  for (const field of ARRAY_FIELDS) {
    if (
      data[field] !== undefined &&
      !Array.isArray(data[field])
    ) {
      return {
        error: `${field} must be an array`,
      };
    }

    if (
      Array.isArray(data[field]) &&
      !data[field].every(
        (item) => typeof item === "string"
      )
    ) {
      return {
        error: `${field} must contain only strings`,
      };
    }
  }

  if (
    data.minPrice !== undefined &&
    (data.minPrice === "" ||
      !Number.isFinite(Number(data.minPrice)))
  ) {
    return { error: "Please enter a valid minimum price" };
  }

  if (
    data.maxPrice !== undefined &&
    (data.maxPrice === "" ||
      !Number.isFinite(Number(data.maxPrice)))
  ) {
    return { error: "Please enter a valid maximum price" };
  }

  if (
    data.minPrice !== undefined &&
    Number(data.minPrice) < 0
  ) {
    return { error: "Minimum price cannot be negative" };
  }

  if (
    data.maxPrice !== undefined &&
    Number(data.maxPrice) < 0
  ) {
    return { error: "Maximum price cannot be negative" };
  }

  return null;
};

// Validate minimum and maximum prices together.
const validatePriceRange = (minimum, maximum) => {
  if (
    !Number.isFinite(Number(minimum)) ||
    !Number.isFinite(Number(maximum)) ||
    Number(minimum) < 0 ||
    Number(maximum) < Number(minimum)
  ) {
    return "Maximum price must be greater than or equal to minimum price";
  }

  return null;
};

// --------------------------------------------------
// GET ALL PROJECTS
// GET /api/projects
// Public route: supports search, filters and sorting.
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      city,
      propertyType,
      sort,
    } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const searchRegex = {
        $regex: escapeRegex(search.trim()),
        $options: "i",
      };

      filter.$or = [
        { name: searchRegex },
        { builder: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
      ];
    }

    if (status) {
      if (!PROJECT_STATUSES.includes(status)) {
        return res.status(400).json({
          message: "Invalid project status",
        });
      }

      filter.status = status;
    }

    if (city && city.trim()) {
      filter.city = {
        $regex: escapeRegex(city.trim()),
        $options: "i",
      };
    }

    if (propertyType) {
      if (!PROPERTY_TYPES.includes(propertyType)) {
        return res.status(400).json({
          message: "Invalid property type",
        });
      }

      filter.propertyType = propertyType;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "low") {
      sortOption = { minPrice: 1 };
    } else if (sort === "high") {
      sortOption = { minPrice: -1 };
    }

    const projects = await Project.find(filter)
      .sort(sortOption);

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);

    return res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

// --------------------------------------------------
// GET FEATURED PROJECTS
// GET /api/projects/featured/list
// Public route.
// --------------------------------------------------
router.get("/featured/list", async (req, res) => {
  try {
    const projects = await Project.find({
      featured: true,
    })
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Featured projects error:", error);

    return res.status(500).json({
      message: "Failed to fetch featured projects",
    });
  }
});

// --------------------------------------------------
// CREATE / PUBLISH PROJECT
// POST /api/projects
// Requires an authenticated, authorized owner.
// Projects publish immediately.
// --------------------------------------------------
router.post(
  "/",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const data = pickProjectFields(req.body);

      const validationError = validateProjectData(
        data,
        true
      );

      if (validationError) {
        return res.status(400).json({
          message: validationError.error,
          ...(validationError.missingFields
            ? { missingFields: validationError.missingFields }
            : {}),
        });
      }

      const priceError = validatePriceRange(
        data.minPrice,
        data.maxPrice
      );

      if (priceError) {
        return res.status(400).json({
          message: priceError,
        });
      }

      data.minPrice = Number(data.minPrice);
      data.maxPrice = Number(data.maxPrice);

      const project = await Project.create({
        ...data,

        // Set from the authenticated user, never from req.body.
        ownerId: req.user._id,

        configurations: data.configurations || [],
        amenities: data.amenities || [],
        images: data.images || [],

        // Publicly visible immediately, but not featured/verified.
        featured: false,
        verified: false,
      });

      return res.status(201).json({
        message: "Project published successfully",
        project,
      });
    } catch (error) {
      console.error("Create project error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Failed to publish project",
      });
    }
  }
);

// --------------------------------------------------
// GET SINGLE PROJECT
// GET /api/projects/:id
// Public route.
// --------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      message: "Failed to fetch project",
    });
  }
});

// --------------------------------------------------
// UPDATE PROJECT
// PUT /api/projects/:id
// Only the project's owner can update it.
// --------------------------------------------------
router.put(
  "/:id",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid project ID",
        });
      }

      const data = pickProjectFields(req.body);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "No valid project fields provided",
        });
      }

      const validationError = validateProjectData(data);

      if (validationError) {
        return res.status(400).json({
          message: validationError.error,
        });
      }

      // Find by both project ID and authenticated owner ID.
      const project = await Project.findOne({
        _id: req.params.id,
        ownerId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found or you do not own this project",
        });
      }

      const minimum =
        data.minPrice !== undefined
          ? Number(data.minPrice)
          : project.minPrice;

      const maximum =
        data.maxPrice !== undefined
          ? Number(data.maxPrice)
          : project.maxPrice;

      const priceError = validatePriceRange(
        minimum,
        maximum
      );

      if (priceError) {
        return res.status(400).json({
          message: priceError,
        });
      }

      if (data.minPrice !== undefined) {
        data.minPrice = minimum;
      }

      if (data.maxPrice !== undefined) {
        data.maxPrice = maximum;
      }

      // Only permitted fields are changed.
      for (const [key, value] of Object.entries(data)) {
        project[key] = value;
      }

      await project.save();

      return res.status(200).json({
        message: "Project updated successfully",
        project,
      });
    } catch (error) {
      console.error("Update project error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Failed to update project",
      });
    }
  }
);

// --------------------------------------------------
// DELETE PROJECT
// DELETE /api/projects/:id
// Only the project's owner can delete it.
// --------------------------------------------------
router.delete(
  "/:id",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid project ID",
        });
      }

      const project = await Project.findOneAndDelete({
        _id: req.params.id,
        ownerId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found or you do not own this project",
        });
      }

      return res.status(200).json({
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete project error:", error);

      return res.status(500).json({
        message: "Failed to delete project",
      });
    }
  }
);

export default router;

