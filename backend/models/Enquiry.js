import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      default: "",
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Enquiry = mongoose.model(
  "Enquiry",
  enquirySchema
);

export default Enquiry;