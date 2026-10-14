import express from "express";

import User from "../models/User.js";
import Property from "../models/Property.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================
// ADD PROPERTY TO FAVOURITES
// =====================================

router.post("/:propertyId", authMiddleware, async (req, res) => {
  try {

    const { propertyId } = req.params;

    // Check property exists
    const property = await Property.findById(
      propertyId
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    // Check if already favourite
    const alreadyFavourite =
      req.user.favourites.some(
        (id) => id.toString() === propertyId
      );

    if (alreadyFavourite) {
      return res.status(400).json({
        message: "Property already added to favourites"
      });
    }

    // Add property
    req.user.favourites.push(propertyId);

    await req.user.save();

    res.json({
      message: "Property added to favourites",
      favourite: true
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to add favourite"
    });
  }
});


// =====================================
// REMOVE PROPERTY FROM FAVOURITES
// =====================================

router.delete("/:propertyId", authMiddleware, async (req, res) => {
  try {

    const { propertyId } = req.params;

    req.user.favourites =
      req.user.favourites.filter(
        (id) => id.toString() !== propertyId
      );

    await req.user.save();

    res.json({
      message: "Property removed from favourites",
      favourite: false
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to remove favourite"
    });
  }
});


// =====================================
// CHECK FAVOURITE
// =====================================

router.get("/check/:propertyId", authMiddleware, async (req, res) => {
  try {

    const { propertyId } = req.params;

    const favourite =
      req.user.favourites.some(
        (id) => id.toString() === propertyId
      );

    res.json({
      favourite
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to check favourite"
    });
  }
});


// =====================================
// GET ALL FAVOURITES
// =====================================

router.get("/", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).populate("favourites");

    res.json(user.favourites);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch favourites"
    });
  }
});


export default router;