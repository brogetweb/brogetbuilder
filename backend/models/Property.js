import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Plot",
        "Independent House",
        "Builder Floor",
      ],
      required: true,
    },

    listingType: {
      type: String,
      enum: ["Buy", "Rent", "PG"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      required: true,
    },

    furnishing: {
      type: String,
      enum: [
        "Furnished",
        "Semi-Furnished",
        "Unfurnished",
      ],
      default: "Unfurnished",
    },

    // NEW PROPERTY DETAILS
    facing: {
      type: String,
      default: "",
      trim: true,
    },

    balconies: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Used for Apartments only
    floor: {
      type: Number,
      default: null,
      min: 0,
    },

    totalFloors: {
      type: Number,
      default: null,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    ownerName: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
