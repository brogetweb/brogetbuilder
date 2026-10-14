import express from "express";

import Property from "../models/Property.js";
import PropertyVisit from "../models/PropertyVisit.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  RECORD PROPERTY VISIT

  A registered/logged-in user opens
  a property details page.
*/
router.post(
  "/:propertyId",
  authMiddleware,
  async (req, res) => {
    try {
      const { propertyId } = req.params;

      const property =
        await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      /*
        Only registered users are recorded.

        If the owner opens their own property,
        we don't record that as a visitor.
      */
      if (
        property.ownerId &&
        property.ownerId.toString() ===
          req.user._id.toString()
      ) {
        return res.json({
          message: "Owner visit not recorded"
        });
      }

      await PropertyVisit.create({
        property: property._id,
        // owner: property.ownerId,
        visitor: req.user._id
      });

      res.json({
        message: "Property visit recorded"
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to record property visit"
      });
    }
  }
);

export default router;