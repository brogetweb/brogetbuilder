
// working for property visit 

// import mongoose from "mongoose";

// const propertyVisitSchema = new mongoose.Schema(
//   {
//     property: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Property",
//       required: true,
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Present when the visitor is logged in.
//     visitor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // Present for anonymous visitors.
//     anonymousVisitorId: {
//       type: String,
//       default: null,
//     },

//     visitedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// const PropertyVisit = mongoose.model(
//   "PropertyVisit",
//   propertyVisitSchema
// );

// export default PropertyVisit;



import mongoose from "mongoose";

const propertyVisitSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: false,
      default: null,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    anonymousVisitorId: {
      type: String,
      required: false,
      default: null,
    },

    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Use the existing model name and collection.
const PropertyVisit =
  mongoose.models.PropertyVisit ||
  mongoose.model("PropertyVisit", propertyVisitSchema);

export default PropertyVisit;

