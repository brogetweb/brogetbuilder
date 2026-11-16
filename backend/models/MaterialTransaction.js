import mongoose from "mongoose";

const materialTransactionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteMaterial",
      required: true,
    },

    type: {
      type: String,
      enum: ["opening", "received", "consumed", "adjustment"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.001,
    },

    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteActivity",
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    reference: {
      type: String,
      default: "",
      trim: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailySiteReport",
      default: null,
    },
  },
  { timestamps: true }
);

materialTransactionSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model(
  "MaterialTransaction",
  materialTransactionSchema
);