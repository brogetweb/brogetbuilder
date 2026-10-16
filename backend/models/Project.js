import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    builder: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
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

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Plot",
        "Independent House",
      ],
      required: true,
    },

    configurations: {
      type: [String],
      default: [],
    },

    minPrice: {
      type: Number,
      required: true,
    },

    maxPrice: {
      type: Number,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "New Launch",
        "Under Construction",
        "Ready to Move",
      ],
      required: true,
    },

    possession: {
      type: String,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    // Owner who published this project
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    contactName: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
