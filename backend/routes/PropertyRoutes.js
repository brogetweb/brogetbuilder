import express from "express";

import mongoose from "mongoose";

import Property from "../models/Property.js";

import authMiddleware from "../middleware/authMiddleware.js";

import ownerMiddleware from "../middleware/ownerMiddleware.js";

const router = express.Router();


// =====================================
// GET ALL PROPERTIES
// =====================================

router.get("/", async (req, res) => {
  try {
    const {
      city,
      location,
      listingType,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishing,
      sort
    } = req.query;

    const filter = {};

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i"
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }

    if (bathrooms) {
      filter.bathrooms = Number(bathrooms);
    }

    if (minArea || maxArea) {
      filter.area = {};

      if (minArea) {
        filter.area.$gte = Number(minArea);
      }

      if (maxArea) {
        filter.area.$lte = Number(maxArea);
      }
    }

    if (furnishing) {
      filter.furnishing = furnishing;
    }

    let query = Property.find(filter);

    // =====================================
    // SORT
    // =====================================

    if (sort === "low") {
      query = query.sort({
        price: 1
      });
    }

    if (sort === "high") {
      query = query.sort({
        price: -1
      });
    }

    if (sort === "newest") {
      query = query.sort({
        createdAt: -1
      });
    }

    if (sort === "oldest") {
      query = query.sort({
        createdAt: 1
      });
    }

    if (sort === "area-low") {
      query = query.sort({
        area: 1
      });
    }

    if (sort === "area-high") {
      query = query.sort({
        area: -1
      });
    }

    const properties = await query;

    res.json(properties);
  } catch (error) {
    console.log("GET ALL PROPERTIES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch properties"
    });
  }
});


// =====================================
// FEATURED PROPERTIES
// =====================================

router.get(
  "/featured/list",
  async (req, res) => {
    try {
      const properties = await Property.find({
        featured: true
      });

      res.json(properties);
    } catch (error) {
      console.log(
        "FEATURED PROPERTIES ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch featured properties"
      });
    }
  }
);


// =====================================
// SIMILAR PROPERTIES
// =====================================

router.get(
  "/similar/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid property ID"
        });
      }

      const property = await Property.findById(id);

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      const similarProperties =
        await Property.find({
          _id: {
            $ne: property._id
          },

          propertyType:
            property.propertyType,

          city: property.city
        }).limit(6);

      res.json(similarProperties);
    } catch (error) {
      console.log(
        "SIMILAR PROPERTIES ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch similar properties"
      });
    }
  }
);


// =====================================
// GET SINGLE PROPERTY
// =====================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        "Fetching property with ID:",
        id
      );

      // Check MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid property ID"
        });
      }

      const property =
        await Property.findById(id);

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      console.log(
        "Property found:",
        property.title
      );

      res.json(property);
    } catch (error) {
      console.log(
        "GET SINGLE PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch property"
      });
    }
  }
);


// =====================================
// POST PROPERTY
// ONLY OWNER CAN POST
// =====================================

router.post(
  "/",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const property =
        await Property.create({
          ...req.body,
          ownerId: req.user._id
        });

      res.status(201).json(property);
    } catch (error) {
      console.log(
        "CREATE PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to create property"
      });
    }
  }
);


// =====================================
// UPDATE PROPERTY
// =====================================

router.put(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid property ID"
        });
      }

      const property =
        await Property.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      res.json(property);
    } catch (error) {
      console.log(
        "UPDATE PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to update property"
      });
    }
  }
);


// =====================================
// DELETE PROPERTY
// =====================================

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid property ID"
        });
      }

      const property =
        await Property.findByIdAndDelete(id);

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      res.json({
        message: "Property deleted successfully"
      });
    } catch (error) {
      console.log(
        "DELETE PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to delete property"
      });
    }
  }
);


export default router;