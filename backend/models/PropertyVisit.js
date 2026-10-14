import mongoose from "mongoose";

const propertyVisitSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    visitedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const PropertyVisit = mongoose.model(
  "PropertyVisit",
  propertyVisitSchema
);

export default PropertyVisit;