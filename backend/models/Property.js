import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Plot",
        "Independent House",
        "Builder Floor"
      ],
      required: true
    },

    listingType: {
      type: String,
      enum: ["Buy", "Rent", "PG"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    bedrooms: {
      type: Number,
      default: 0
    },

    bathrooms: {
      type: Number,
      default: 0
    },

    area: {
      type: Number,
      required: true
    },

    furnishing: {
      type: String,
      enum: [
        "Furnished",
        "Semi-Furnished",
        "Unfurnished"
      ],
      default: "Unfurnished"
    },

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    ownerName: {
      type: String,
      required: true
    },

    contactNumber: {
      type: String,
      required: true
    },

    // IMPORTANT
    // This connects the property
    // with the registered owner account.
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    featured: {
      type: Boolean,
      default: false
    },

    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

export default Property;